import 'dotenv/config';
import fs from 'node:fs/promises';
import pLimit from 'p-limit';
import fetch from 'node-fetch';
import admin from 'firebase-admin';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// ---------------- env ----------------
const DRY = process.env.DRY_RUN === '1';
const FORCE = process.env.FORCE === '1';

const COLL = process.env.LESSONS_COLL || 'EnglishB1Lessons';
const ID_FROM = Number(process.env.ID_LESSONS_FROM || 0);
const ID_TO   = Number(process.env.ID_LESSONS_TO || 0);
const LIMIT = Number(process.env.LIMIT || 0);
const CONC = Number(process.env.CONCURRENCY || 4);

const LEVEL = process.env.LEVEL || 'B1';
const VERSION = process.env.VERSION || 'v1';

// KV prefix normalize
const RAW_PREFIX = process.env.KV_PREFIX_LESSONS || 'lessons/en/';
const KV_PREFIX = RAW_PREFIX.endsWith('/') ? RAW_PREFIX : RAW_PREFIX + '/';

// R2
const R2_BUCKET = process.env.R2_BUCKET;
if (!R2_BUCKET) throw new Error('R2_BUCKET is required');

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

if (!CF_ACCOUNT_ID || !CF_KV_NAMESPACE || !CF_API_TOKEN) {
  throw new Error('CF_ACCOUNT_ID, CF_KV_NAMESPACE, CF_API_TOKEN are required');
}

// TTS
const tts = new TextToSpeechClient();

// Firestore
const saPath = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!saPath) throw new Error('FIREBASE_SERVICE_ACCOUNT is required');

const svc = JSON.parse(await fs.readFile(saPath, 'utf8'));
admin.initializeApp({ credential: admin.credential.cert(svc), projectId: svc.project_id });
const db = admin.firestore();

// ---------------- helpers ----------------
const limit = pLimit(CONC);

const emptyLike = (v) => v === '' || v === null || typeof v === 'undefined';

const GB_VOICES = ['en-GB-Wavenet-A', 'en-GB-Wavenet-B'];
const US_VOICES = ['en-US-Wavenet-C', 'en-US-Wavenet-D'];
const pickVoice = (locale, i) => (locale === 'en-GB' ? GB_VOICES : US_VOICES)[i % 2];

const escapeXml = (s='') => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const ssml = (t) => `<speak><p>${escapeXml(t)}</p></speak>`;

function hash(s){ let h=0; for(const ch of String(s)) {h=(h<<5)-h+ch.charCodeAt(0); h|=0;} return h; }

async function synthText(text, locale, voiceName, rate=1.0) {
  if (DRY) return Buffer.from('');
  const [resp] = await tts.synthesizeSpeech({
    input: { ssml: ssml(text) },
    voice: { languageCode: locale, name: voiceName },
    audioConfig: { audioEncoding: 'MP3', sampleRateHertz: 24000, speakingRate: rate },
  });

  const ac = resp.audioContent;
  if (!ac) return Buffer.from('');
  // audioContent can be Buffer | Uint8Array | string depending on lib/version
  if (Buffer.isBuffer(ac)) return ac;
  if (typeof ac === 'string') return Buffer.from(ac, 'base64');
  return Buffer.from(ac);
}

// R2
async function r2Exists(key) {
  try {
    await R2.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function putR2(key, bytes) {
  if (DRY) return;
  await R2.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: bytes,
    ContentType: 'audio/mpeg',
    CacheControl: 'public, max-age=31536000, immutable',
  }));
}

// KV
async function putKV(key, obj) {
  if (DRY) return;

  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE}/values/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj),
  });

  if (!res.ok) throw new Error(`KV put failed ${res.status}: ${await res.text()}`);
}

// ---------------- lesson audio tasks ----------------
function collectLessonAudioTasks(lessonDoc) {
  // Your lesson model:
  // lessonDoc.text.part1.british.textWithAudio.text + audioUrl, etc.
  const tasks = [];
  const lessonNo = lessonDoc?.lesson;

  const variants = [
    { part: 'part1', variety: 'british',  locale: 'en-GB' },
    { part: 'part1', variety: 'american', locale: 'en-US' },
    { part: 'part2', variety: 'british',  locale: 'en-GB' },
    { part: 'part2', variety: 'american', locale: 'en-US' },
  ];

  let seq = Math.abs(hash(String(lessonNo)));

  for (const v of variants) {
    const twa = lessonDoc?.text?.[v.part]?.[v.variety]?.textWithAudio;
    const text = twa?.text || '';
    const key = twa?.audioUrl;

    if (!text.trim()) {
      tasks.push({ kind: 'warn', msg: `Missing text for lesson ${lessonNo} ${v.part}.${v.variety}` });
      continue;
    }

    if (!key || emptyLike(key)) {
      // We DO NOT invent keys by default because you asked to use links from Firestore.
      tasks.push({ kind: 'warn', msg: `Missing audioUrl for lesson ${lessonNo} ${v.part}.${v.variety}` });
      continue;
    }

    tasks.push({
      kind: 'lessonText',
      lesson: lessonNo,
      part: v.part,
      variety: v.variety,
      locale: v.locale,
      key,
      text,
      voice: pickVoice(v.locale, seq++),
    });
  }

  return tasks;
}

// ---------------- per-lesson pipeline ----------------
async function processLessonDoc(snap) {
  const lesson = snap.data();
  const lessonNo = lesson.lesson;

  // 1) synth + upload audio
  const tasks = collectLessonAudioTasks(lesson);

  const synthTasks = tasks.filter(t => t.kind === 'lessonText');
  const warnings = tasks.filter(t => t.kind === 'warn');

  warnings.forEach(w => console.warn('⚠', w.msg));

  await Promise.all(synthTasks.map(t => limit(async () => {
    if (!FORCE) {
      const exists = await r2Exists(t.key);
      if (exists) return;
    }
    const buf = await synthText(t.text, t.locale, t.voice);
    await putR2(t.key, buf);
  })));

  // 2) KV write raw lesson JSON
  const kvKey = `${KV_PREFIX}${LEVEL}/${String(lessonNo)}.json`;
  await putKV(kvKey, lesson);

  console.log(`✓ lesson ${lessonNo} — audio:${synthTasks.length}, KV:${kvKey}`);
}

// ---------------- main ----------------
async function main() {
  console.log(`DRY_RUN=${DRY?'YES':'NO'} FORCE=${FORCE?'YES':'NO'} COLL=${COLL}`);
  console.log(`R2_BUCKET=${R2_BUCKET} KV_PREFIX=${KV_PREFIX} LEVEL=${LEVEL} VERSION=${VERSION}`);

  let q = db.collection(COLL);

  // Range by the numeric field "lesson"
  if (ID_FROM) q = q.where('lesson', '>=', ID_FROM);
  if (ID_TO)   q = q.where('lesson', '<=', ID_TO);
  q = q.orderBy('lesson');

  if (LIMIT > 0) q = q.limit(LIMIT);

  const snaps = await q.get();
  if (snaps.empty) {
    console.log('No lessons match query.');
    return;
  }

  for (const s of snaps.docs) {
    await processLessonDoc(s);
  }

  console.log(`Done: ${snaps.size} lesson(s).`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
