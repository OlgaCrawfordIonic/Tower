import 'dotenv/config';
import fs from 'node:fs/promises';
import slugify from 'slugify';
import pLimit from 'p-limit';
import fetch from 'node-fetch';
import admin from 'firebase-admin';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// ---- env ----
const DRY = process.env.DRY_RUN === '1';
const FORCE = process.env.FORCE === '1';
const COLL = process.env.WORDS_COLL || 'EnglishB1words';
const ID_FROM = Number(process.env.ID_FROM || 0);
const ID_TO   = Number(process.env.ID_TO || 0);
const LIMIT = Number(process.env.LIMIT || 0);
const CONC = Number(process.env.CONCURRENCY || 4);

// KV prefix normalize
const RAW_PREFIX = process.env.KV_PREFIX || 'lex/en/';
const KV_PREFIX = RAW_PREFIX.endsWith('/') ? RAW_PREFIX : RAW_PREFIX + '/';

// R2
const R2_BUCKET = process.env.R2_BUCKET;
const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// KV
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const CF_KV_NAMESPACE = process.env.CF_KV_NAMESPACE;
const CF_API_TOKEN = process.env.CF_API_TOKEN;

// TTS
const tts = new TextToSpeechClient();

// Firestore
const saPath = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!saPath) throw new Error('FIREBASE_SERVICE_ACCOUNT is required');
const svc = JSON.parse(await fs.readFile(saPath, 'utf8'));
admin.initializeApp({ credential: admin.credential.cert(svc), projectId: svc.project_id });
const db = admin.firestore();

// ---- helpers ----
const limit = pLimit(CONC);
const slug = (s) => slugify(String(s || ''), { lower: true, strict: true });
const firstLevel = (levels) => (Array.isArray(levels) && levels.length ? String(levels[0]) : 'B1');
const emptyLike = (v) => v === '' || v === null || typeof v === 'undefined';

const topicKeySegment = (t) => slug(t || 'topic');
const keyPrefix = (locale, level, lemma) => {
  const id = slug(lemma); const shard = id[0] || '_';
  return `${locale}/${level}/${shard}/${id}/`;
};

// voices
const GB_VOICES = ['en-GB-Wavenet-A', 'en-GB-Wavenet-B'];
const US_VOICES = ['en-US-Wavenet-C', 'en-US-Wavenet-D'];
const pickVoice = (locale, i) => (locale === 'en-GB' ? GB_VOICES : US_VOICES)[i % 2];

// TTS
const escapeXml = (s='') => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const ssml = (t) => `<speak><p>${escapeXml(t)}</p></speak>`;
const ssmlHead = (w) => `<speak><emphasis level="moderate">${escapeXml(w)}</emphasis></speak>`;

async function synthText(text, locale, voiceName, rate=1.0) {
  if (DRY) return Buffer.from('');
  const [resp] = await tts.synthesizeSpeech({
    input: { ssml: ssml(text) },
    voice: { languageCode: locale, name: voiceName },
    audioConfig: { audioEncoding: 'MP3', sampleRateHertz: 24000, speakingRate: rate },
  });
  return Buffer.from(resp.audioContent, 'base64');
}
async function synthHead(word, locale, voiceName, rate=0.95) {
  if (DRY) return Buffer.from('');
  const [resp] = await tts.synthesizeSpeech({
    input: { ssml: ssmlHead(word) },
    voice: { languageCode: locale, name: voiceName },
    audioConfig: { audioEncoding: 'MP3', sampleRateHertz: 24000, speakingRate: rate },
  });
  return Buffer.from(resp.audioContent, 'base64');
}

// R2
async function r2Exists(key) {
  try { await R2.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key })); return true; }
  catch { return false; }
}
async function putR2(key, bytes) {
  if (DRY) return;
  await R2.send(new PutObjectCommand({
    Bucket: R2_BUCKET, Key: key, Body: bytes, ContentType: 'audio/mpeg',
    CacheControl: 'public, max-age=31536000, immutable',
  }));
}

// KV
async function putKV(key, obj) {
  if (DRY) return;
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE}/values/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${CF_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  });
  if (!res.ok) throw new Error(`KV put failed ${res.status}: ${await res.text()}`);
}

// ---------- build TTS tasks WITHOUT mutating the doc ----------
function collectAudioTasks(doc) {
  const tasks = [];
  const level = firstLevel(doc.levels);
  let seq = Math.abs(hash(String(doc.lemma)));

  // variants
  for (const loc of ['en-GB','en-US']) {
    const phon = doc?.variants?.[loc]?.phonetics;
    const key = phon?.audioUrl;
    if (key && !emptyLike(key)) {
      const word = (loc === 'en-GB' ? (doc.english || doc.lemma) : (doc.american || doc.lemma)) || doc.lemma;
      tasks.push({ kind:'variant', locale:loc, key, text: word, voice: pickVoice(loc, seq++) });
    }
  }

  // parts/senses
  for (const posEntry of (doc.partsOfSpeech||[])) {
    const pos = String(posEntry?.partOfSpeech || 'other').toLowerCase();
    const defs = posEntry?.definitions || [];
    defs.forEach((def, j) => {
      const senseId = def?.senseId || `s${j+1}`;
      const getHW = (loc) => def?.headwords?.[loc] ?? def?.definition?.[loc]?.headwords ?? null;

      // headwords
      for (const loc of ['en-GB','en-US']) {
        const hw = getHW(loc);
        const key = hw?.audioUrl;
        if (hw?.headword && key && !emptyLike(key)) {
          tasks.push({ kind:'headword', locale:loc, key, text: hw.headword, voice: pickVoice(loc, seq++) });
        }
      }

      // definitions
      for (const loc of ['en-GB','en-US']) {
        const d = def?.definition?.[loc];
        const key = d?.audioUrl;
        if (d?.text && key && !emptyLike(key)) {
          tasks.push({ kind:'definition', locale:loc, key, text: d.text, voice: pickVoice(loc, seq++) });
        }
      }

      // examples (US falls back to GB text at same index)
      const gb = def?.examples?.['en-GB'] || [];
      const us = def?.examples?.['en-US'] || [];

      gb.forEach((ex,i) => {
        const key = ex?.audioUrl;
        if (ex?.text && key && !emptyLike(key)) {
          tasks.push({ kind:'example', locale:'en-GB', key, text: ex.text, voice: pickVoice('en-GB', seq++) });
        }
      });
      us.forEach((ex,i) => {
        const text = (ex?.text && ex.text.trim()) ? ex.text : (gb[i]?.text || '');
        const key = ex?.audioUrl;
        if (text && key && !emptyLike(key)) {
          tasks.push({ kind:'example', locale:'en-US', key, text, voice: pickVoice('en-US', seq++) });
        }
      });
    });
  }

  // topics
  for (const t of (doc.topics||[])) {
    const gb = t?.examples?.['en-GB'] || [];
    const us = t?.examples?.['en-US'] || [];
    gb.forEach((ex,i) => {
      const key = ex?.audioUrl;
      if (ex?.text && key && !emptyLike(key)) {
        tasks.push({ kind:'topic', locale:'en-GB', key, text: ex.text, voice: pickVoice('en-GB', seq++) });
      }
    });
    us.forEach((ex,i) => {
      const text = (ex?.text && ex.text.trim()) ? ex.text : (gb[i]?.text || '');
      const key = ex?.audioUrl;
      if (text && key && !emptyLike(key)) {
        tasks.push({ kind:'topic', locale:'en-US', key, text, voice: pickVoice('en-US', seq++) });
      }
    });
  }

  return tasks;
}


function hash(s){let h=0; for(const ch of String(s)) {h=(h<<5)-h+ch.charCodeAt(0); h|=0;} return h;}

// ---- per-doc pipeline ----
async function processDoc(snap){
  const doc = snap.data();
  const lemma = doc.lemma;
  const docId = slug(lemma);
  const level = firstLevel(doc.levels);

  // 1) synth & upload audio for every existing audioUrl
  const tasks = collectAudioTasks(doc);
  await Promise.all(tasks.map(t => limit(async () => {
    if (!FORCE) {
      const exists = await r2Exists(t.key);
      if (exists) return;
    }
    const buf = (t.kind === 'headword')
      ? await synthHead(t.text, t.locale, t.voice)
      : await synthText(t.text, t.locale, t.voice);
    await putR2(t.key, buf);
  })));

  // 2) KV: write the raw doc JSON (unchanged)
  const kvKey = `${KV_PREFIX}${level}/${docId}.json`;
  await putKV(kvKey, doc);

  console.log(`✓ ${lemma} — audio:${tasks.length}, KV:${kvKey}`);
}

// ---- main ----
async function main(){
  console.log(`DRY_RUN=${DRY?'YES':'NO'} FORCE=${FORCE?'YES':'NO'} COLL=${COLL}`);
  let q = db.collection(COLL);

  if (ID_FROM) q = q.where('id','>=',ID_FROM);
  if (ID_TO)   q = q.where('id','<=',ID_TO);
  q = q.orderBy('id');
  if (LIMIT>0) q = q.limit(LIMIT);

  const snaps = await q.get();
  if (snaps.empty) { console.log('No docs match.'); return; }

  for (const s of snaps.docs) {
    await processDoc(s);
  }
  console.log(`Done: ${snaps.size} doc(s).`);
}

main().catch(e => { console.error(e); process.exit(1); });

//// dry (no uploads, no KV writes)
//DRY_RUN=1 node scripts/publish_audio_and_kv.mjs

////real
//node scripts/publish_audio_and_kv.mjs
