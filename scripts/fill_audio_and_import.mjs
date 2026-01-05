// Usage:
// npm run dry     -> DRY_RUN=1 node scripts/fill_audio_and_import.mjs ./data/lemmas.json
// npm start       -> node scripts/fill_audio_and_import.mjs ./data/lemmas.json
//
// Requires .env with FIREBASE_SERVICE_ACCOUNT=/ABS/PATH/firebase-admin.json

import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import slugify from 'slugify';
import admin from 'firebase-admin';

// ----- config -----
const INPUT = process.env.LEMMAS_JSON || process.argv[2];
if (!INPUT) {
  console.error('Provide lemmas JSON via LEMMAS_JSON or argv[2].');
  process.exit(1);
}
const DRY = process.env.DRY_RUN === '1';
const COLL = 'EnglishB1words';

// ----- firestore init -----
const saPath = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!saPath) {
  console.error('FIREBASE_SERVICE_ACCOUNT is required (absolute path to service account JSON).');
  process.exit(1);
}
const serviceAccount = JSON.parse(await fs.readFile(saPath, 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});
const db = admin.firestore();

// ----- utils -----
const slug = (s) => slugify(String(s || ''), { lower: true, strict: true });
const firstLevel = (levels) => (Array.isArray(levels) && levels.length ? String(levels[0]) : 'B1');
const emptyLike = (v) => v === '' || v === null || typeof v === 'undefined';

const keyPrefix = (locale, level, lemma) => {
  const id = slug(lemma);
  const shard = id[0] || '_';
  return `${locale}/${level}/${shard}/${id}/`;
};
const topicKeySegment = (topicKey) => slug(topicKey || 'topic');

const headwordsDiffer = (hw) => {
  const gb = hw?.['en-GB']?.text?.trim().toLowerCase() || null;
  const us = hw?.['en-US']?.text?.trim().toLowerCase() || null;
  return gb && us && gb !== us;
};

// ---------- NEW: create en-US example shells with only the link ----------
function ensureUSExampleShells(doc) {
  const level = firstLevel(doc.levels);

  // A) Sense-level examples
  (doc.partsOfSpeech ?? []).forEach((posEntry) => {
    const pos = String(posEntry?.partOfSpeech || 'other').toLowerCase();
    (posEntry.definitions ?? []).forEach((def, idx) => {
      const senseId = def?.senseId || `s${idx + 1}`;
      const gbArr = def?.examples?.['en-GB'];
      const usArr = def?.examples?.['en-US'];

      // Only when GB exists and US is an empty array
      if (Array.isArray(gbArr) && Array.isArray(usArr) && usArr.length === 0) {
        def.examples['en-US'] = gbArr.map((_, exIdx) => ({
          text: "",
          audioUrl: `${keyPrefix('en-US', level, doc.lemma)}senses/${pos}/${senseId}/examples/${exIdx}.mp3`,
          partOfSpeech: "",
          senseId: ""
        }));
      }
    });
  });

  // B) Topic examples
  (doc.topics ?? []).forEach((t) => {
    const tkey = topicKeySegment(t?.topicKey);
    const gbArr = t?.examples?.['en-GB'];
    const usArr = t?.examples?.['en-US'];

    if (Array.isArray(gbArr) && Array.isArray(usArr) && usArr.length === 0) {
      t.examples['en-US'] = gbArr.map((_, exIdx) => ({
        text: "",
        audioUrl: `${keyPrefix('en-US', level, doc.lemma)}topics/${tkey}/examples/${exIdx}.mp3`,
        partOfSpeech: "",
        senseId: ""
      }));
    }
  });

  return doc;
}

// ----- fillers (unchanged rules) -----
function fillVariants(doc, level) {
  for (const loc of ['en-GB', 'en-US']) {
    const phon = doc?.variants?.[loc]?.phonetics;
    if (!phon) continue;
    if (!Object.prototype.hasOwnProperty.call(phon, 'audioUrl')) continue;
    if (!emptyLike(phon.audioUrl)) continue;
    phon.audioUrl = `${keyPrefix(loc, level, doc.lemma)}ipa.mp3`;
  }
}

function fillPartsOfSpeech(doc, level) {
  const posArray = Array.isArray(doc.partsOfSpeech) ? doc.partsOfSpeech : [];
  posArray.forEach((posEntry) => {
    const pos = String(posEntry?.partOfSpeech || 'other').toLowerCase();
    const defs = Array.isArray(posEntry?.definitions) ? posEntry.definitions : [];
    defs.forEach((def, defIdx) => {
      const senseId = def?.senseId || `s${defIdx + 1}`;

      // Sense headword audio only if GB vs US texts differ
      if (def?.headwords && headwordsDiffer(def.headwords)) {
        for (const loc of ['en-GB', 'en-US']) {
          const hw = def.headwords[loc];
          if (!hw) continue;
          if (Object.prototype.hasOwnProperty.call(hw, 'audioUrl') && emptyLike(hw.audioUrl)) {
            hw.audioUrl = `${keyPrefix(loc, level, doc.lemma)}senses/${pos}/${senseId}/headword.mp3`;
          }
          const ph = hw?.phonetics;
          if (ph && Object.prototype.hasOwnProperty.call(ph, 'audioUrl') && emptyLike(ph.audioUrl)) {
            ph.audioUrl = `${keyPrefix(loc, level, doc.lemma)}ipa.mp3`;
          }
        }
      } else {
        // If no difference, do not create headword audio; if phonetics.audioUrl exists & empty, set ipa
        for (const loc of ['en-GB', 'en-US']) {
          const ph = def?.headwords?.[loc]?.phonetics;
          if (ph && Object.prototype.hasOwnProperty.call(ph, 'audioUrl') && emptyLike(ph.audioUrl)) {
            ph.audioUrl = `${keyPrefix(loc, level, doc.lemma)}ipa.mp3`;
          }
        }
      }

      // Definition audio
      for (const loc of ['en-GB', 'en-US']) {
        const defLoc = def?.definition?.[loc];
        if (!defLoc) continue;
        if (Object.prototype.hasOwnProperty.call(defLoc, 'audioUrl') && emptyLike(defLoc.audioUrl)) {
          defLoc.audioUrl = `${keyPrefix(loc, level, doc.lemma)}senses/${pos}/${senseId}/definition.mp3`;
        }
      }

      // Examples audio (fills only if property exists & empty; our US shells already have links)
      for (const loc of ['en-GB', 'en-US']) {
        const exArr = def?.examples?.[loc];
        if (!Array.isArray(exArr)) continue;
        exArr.forEach((ex, idx) => {
          if (Object.prototype.hasOwnProperty.call(ex, 'audioUrl') && emptyLike(ex.audioUrl)) {
            ex.audioUrl = `${keyPrefix(loc, level, doc.lemma)}senses/${pos}/${senseId}/examples/${idx}.mp3`;
          }
        });
      }
    });
  });
}

function fillTopics(doc, level) {
  const topics = Array.isArray(doc.topics) ? doc.topics : [];
  topics.forEach((t) => {
    const tkey = topicKeySegment(t?.topicKey);
    for (const loc of ['en-GB', 'en-US']) {
      const exArr = t?.examples?.[loc];
      if (!Array.isArray(exArr)) continue;
      exArr.forEach((ex, idx) => {
        if (Object.prototype.hasOwnProperty.call(ex, 'audioUrl') && emptyLike(ex.audioUrl)) {
          ex.audioUrl = `${keyPrefix(loc, level, doc.lemma)}topics/${tkey}/examples/${idx}.mp3`;
        }
      });
    }
  });
}

function fillOneDoc(doc) {
  // 1) Create en-US example shells (only links) where US arrays exist and are empty
  ensureUSExampleShells(doc);

  // 2) Fill remaining empty audioUrl fields per your rules
  const level = firstLevel(doc.levels);
  fillVariants(doc, level);
  fillPartsOfSpeech(doc, level);
  fillTopics(doc, level);
  return doc;
}

// ----- main -----
const raw = JSON.parse(await fs.readFile(INPUT, 'utf8'));
const words = Array.isArray(raw) ? raw : Array.isArray(raw.words) ? raw.words : [];
if (!words.length) {
  console.error('No words found in input JSON (expected array or {words:[]}).');
  process.exit(1);
}

let updated = 0;
for (const doc of words) {
  fillOneDoc(doc);
  updated++;
  if (!DRY) {
    const docId = slug(doc.lemma);
    await db.collection(COLL).doc(docId).set(
      {
        ...doc,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }
}

if (DRY) {
  const out = Array.isArray(raw) ? words : { words };
  const outPath = path.join(
    path.dirname(INPUT),
    path.basename(INPUT).replace(/\.json$/i, '') + '.filled.json'
  );
  await fs.writeFile(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`DRY RUN: wrote preview to ${outPath} (no Firestore writes).`);
} else {
  console.log(`Imported ${updated} docs into ${COLL}.`);
}
