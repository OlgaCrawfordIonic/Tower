// scripts/relink_ids_1_to_5_existing_fields_only.mjs
import 'dotenv/config';
import fs from 'node:fs/promises';
import admin from 'firebase-admin';
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import slugify from 'slugify';

/* ==== ENV / CONFIG ==== */
const VERIFY_R2 = process.env.VERIFY_R2 !== '0';
const R2_BUCKET = process.env.R2_BUCKET;

/* ==== Firebase Admin ==== */
const svc = JSON.parse(await fs.readFile(process.env.FIREBASE_SERVICE_ACCOUNT, 'utf8'));
if (admin.apps.length === 0) admin.initializeApp({ credential: admin.credential.cert(svc) });
const db = admin.firestore();

/* ==== R2 (S3) ==== */
const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY }
});
const r2Exists = async (Key) => {
  if (!VERIFY_R2) return true;
  try { await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key })); return true; }
  catch { return false; }
};

/* ==== Helpers ==== */
const slug = s => slugify(s || '', { lower: true, strict: true });
const level0 = a => (Array.isArray(a) && a.length ? a[0] : 'B1');
const keyPrefix = (lang, level, lemma) => {
  const id = slug(lemma); const shard = id[0] || '_';
  return `${lang}/${level}/${shard}/${id}/`;
};
const emptyLike = v => v === '' || v === null || v === undefined;
const hasOwn = (obj, prop) => obj && Object.prototype.hasOwnProperty.call(obj, prop);

/* ==== Relink one doc, writing ONLY existing audioUrl fields that are empty ==== */
async function relinkDoc(docSnap) {
  const ref = docSnap.ref;
  const d = docSnap.data();
  const lemma = d.lemma;
  const lvl = level0(d.levels);
  const pGB = keyPrefix('en-GB', lvl, lemma);
  const pUS = keyPrefix('en-US', lvl, lemma);

  const updates = {};
  let wrote = 0;

  // 1) Headword phonetics (only if audioUrl property exists AND is empty)
  for (const loc of ['en-GB', 'en-US']) {
    const phon = d?.variants?.[loc]?.phonetics;
    if (!phon) continue;
    if (!hasOwn(phon, 'audioUrl')) continue;                // don't create new field
    if (!emptyLike(phon.audioUrl)) continue;                // already set

    const key = loc === 'en-GB' ? `${pGB}headword.mp3` : `${pUS}headword.mp3`;
    if (await r2Exists(key)) {
      updates[`variants.${loc}.phonetics.audioUrl`] = key;
      wrote++;
    } else {
      console.warn('R2 missing:', key);
    }
  }

  // 2) Parts of speech: definitions + examples (only update existing audioUrl props)
  const posArr = Array.isArray(d.partsOfSpeech) ? d.partsOfSpeech : [];
  for (let i = 0; i < posArr.length; i++) {
    const pos = (posArr[i]?.partOfSpeech || '').toLowerCase() || 'other';
    const defs = Array.isArray(posArr[i]?.definitions) ? posArr[i].definitions : [];
    for (let j = 0; j < defs.length; j++) {
      const def = defs[j];
      const senseId = def?.senseId || `s${j+1}`;

      // 2a) Definition audio: only if definition[locale] exists AND has its own audioUrl that is empty
      for (const loc of ['en-GB','en-US']) {
        const dObj = def?.definition?.[loc];
        if (!dObj?.text) continue;
        if (!hasOwn(dObj, 'audioUrl')) continue;
        if (!emptyLike(dObj.audioUrl)) continue;

        const key = loc === 'en-GB'
          ? `${pGB}senses/${pos}/${senseId}/definition.mp3`
          : `${pUS}senses/${pos}/${senseId}/definition.mp3`;
        if (await r2Exists(key)) {
          updates[`partsOfSpeech.${i}.definitions.${j}.definition.${loc}.audioUrl`] = key;
          wrote++;
        } else {
          console.warn('R2 missing:', key);
        }
      }

      // 2b) Examples audio: only for items that already exist and have their own audioUrl prop empty
      for (const loc of ['en-GB','en-US']) {
        const arr = Array.isArray(def?.examples?.[loc]) ? def.examples[loc] : [];
        for (let k = 0; k < arr.length; k++) {
          const item = arr[k];
          if (!item?.text) continue;
          if (!hasOwn(item, 'audioUrl')) continue;          // don't create
          if (!emptyLike(item.audioUrl)) continue;

          const key = loc === 'en-GB'
            ? `${pGB}senses/${pos}/${senseId}/examples/${k}.mp3`
            : `${pUS}senses/${pos}/${senseId}/examples/${k}.mp3`;
          if (await r2Exists(key)) {
            updates[`partsOfSpeech.${i}.definitions.${j}.examples.${loc}.${k}.audioUrl`] = key;
            wrote++;
          } else {
            console.warn('R2 missing:', key);
          }
        }
      }
    }
  }

  // 3) Topics examples: only update existing items' audioUrl props that are empty
  const topics = Array.isArray(d.topics) ? d.topics : [];
  for (let t = 0; t < topics.length; t++) {
    const topicKey = topics[t]?.topicKey || `topic${t}`;
    for (const loc of ['en-GB','en-US']) {
      const arr = Array.isArray(topics[t]?.examples?.[loc]) ? topics[t].examples[loc] : [];
      for (let k = 0; k < arr.length; k++) {
        const item = arr[k];
        if (!item?.text) continue;
        if (!hasOwn(item, 'audioUrl')) continue;            // don't create
        if (!emptyLike(item.audioUrl)) continue;

        const key = loc === 'en-GB'
          ? `${pGB}topics/${slug(topicKey)}/examples/${k}.mp3`
          : `${pUS}topics/${slug(topicKey)}/examples/${k}.mp3`;
        if (await r2Exists(key)) {
          updates[`topics.${t}.examples.${loc}.${k}.audioUrl`] = key;
          wrote++;
        } else {
          console.warn('R2 missing:', key);
        }
      }
    }
  }

  if (!wrote && Object.keys(updates).length === 0) {
    console.log('No eligible empty audioUrl fields in', ref.id);
    return;
  }
  await ref.set(updates, { merge: true });
  console.log(`Linked ${wrote} existing audioUrl fields for ${ref.id} (id=${d.id}, lemma=${d.lemma})`);
}

/* ==== Run: IDs 1..5 explicitly ==== */
async function main() {
  console.log('Relinking ONLY existing audioUrl fields for docs where id in [1..5].');
  const snap = await db.collection('EnglishB1words')
    .where('id', '>=', 1)
    .where('id', '<=', 5)
    .orderBy('id')
    .get();

  const tasks = [];
  snap.forEach(doc => tasks.push(relinkDoc(doc)));
  await Promise.all(tasks);
  console.log('Done.');
}

main().catch(e => { console.error(e); process.exit(1); });
