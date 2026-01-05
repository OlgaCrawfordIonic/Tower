import { Component } from '@angular/core';
import { getFirestore, writeBatch, doc, serverTimestamp,getDoc} from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-importfirebase',
  templateUrl: './importfirebase.page.html',
    styleUrls: ['./importfirebase.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule, RouterLink]
})
export class ImportFirebasePage {
  jsonText = '';
  jsonPlaceholder = '{\n  "words": [ /* WordDoc, ... */ ]\n}';
  checking = false;
  importing = false;

  hasChecked = false;
  issues: Array<{ type: string; message: string; lemma?: string; details?: any }> = [];
  validCount = 0;
  totalCount = 0;

  error = '';
  importError = '';
  importSuccess = '';

  private db = getFirestore();

  // ---------- UI ----------
  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { this.jsonText = String(reader.result || ''); };
    reader.readAsText(file);
  }

  async onCheckClick() {
    this.resetMsgs();
    this.checking = true;
    try {
      const words = this.parseWordsOrThrow(this.jsonText);
      const { issues, valid, total } = this.validateWords(words);
      this.issues = issues;
      this.validCount = valid;
      this.totalCount = total;
      this.hasChecked = true;
    } catch (e: any) {
      this.error = e?.message ?? String(e);
    } finally {
      this.checking = false;
    }
  }

  async onCreateNewClick() {
    this.resetMsgs();
    this.importing = true;

    try {
      const words = this.parseWordsOrThrow(this.jsonText);
      const { issues } = this.validateWords(words);
      this.hasChecked = true;
      this.issues = issues;
      this.validCount = words.length;
      this.totalCount = words.length;

      if (issues.length) {
        throw new Error('Fix validation issues before importing.');
      }

      // Fill audio URLs in memory
      words.forEach((w) => this.fillAudioForWord(w));

      // === Preflight: check Firestore existence & id/lemma match ===
      const check = await this.checkExistingDocs(words);
      if (check.conflicts.length) {
        const lines = check.conflicts.map(c =>
          `Doc '${c.docId}': existing {id:${c.existingId}, lemma:"${c.existingLemma}"} vs incoming {id:${c.incomingId}, lemma:"${c.incomingLemma}"}`
        ).join('\n');
        throw new Error(`Conflict(s) found — aborting:\n${lines}`);
      }

      const toCreate = check.toCreate;   // only new docs
      const skipped = check.skipped;     // already there (same id+lemma)

      // Write only NEW docs
     const batch = writeBatch(this.db);
for (const d of toCreate) {
  const docId = this.slug(d.lemma);
  batch.set(
    doc(this.db, 'EnglishB1words', docId),
    { ...d, updatedAt: serverTimestamp() },
    { merge: false }
  );
}
await batch.commit();


      this.importSuccess =
        `Created ${toCreate.length} new doc(s). Skipped ${skipped.length} existing.`;
    } catch (e: any) {
      this.importError = e?.message ?? String(e);
    } finally {
      this.importing = false;
    }
  }

  // ---------- Preflight existence check ----------
 private async checkExistingDocs(words: any[]) {
  type CreateRes = { action: 'create'; data: any };
  type SkipRes = { action: 'skip'; docId: string };
  type ConflictRes = {
    action: 'conflict';
    docId: string;
    existingId: any;
    existingLemma: any;
    incomingId: any;
    incomingLemma: any;
  };
  type CheckRes = CreateRes | SkipRes | ConflictRes;

  const toCreate: any[] = [];
  const skipped: Array<{ docId: string }> = [];
  const conflicts: ConflictRes[] = [];

  const chunks = (arr: any[], n = 20) =>
    Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, (i + 1) * n));

  for (const group of chunks(words, 20)) {
    const results: CheckRes[] = await Promise.all(
      group.map(async (incoming): Promise<CheckRes> => {
        const docId = this.slug(incoming.lemma);
        const ref = doc(this.db, 'EnglishB1words', docId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          return { action: 'create', data: incoming };
        }

        const existing = snap.data() || {};
        const existingId = existing['id'];
        const existingLemma = existing['lemma'];

        if (existingId === incoming.id && existingLemma === incoming.lemma) {
          return { action: 'skip', docId };
        }
        return {
          action: 'conflict',
          docId,
          existingId,
          existingLemma,
          incomingId: incoming.id,
          incomingLemma: incoming.lemma,
        };
      })
    );

    for (const r of results) {
      switch (r.action) {
        case 'create':
          toCreate.push(r.data);
          break;
        case 'skip':
          skipped.push({ docId: r.docId });
          break;
        case 'conflict':
          conflicts.push(r);
          break;
      }
    }
  }

  return { toCreate, skipped, conflicts };
}


  // ---------- Parse / validate ----------
  private parseWordsOrThrow(raw: string): any[] {
    let parsed: any;
    try { parsed = JSON.parse(raw); }
    catch { throw new Error('Invalid JSON.'); }
    const arr = Array.isArray(parsed) ? parsed : Array.isArray(parsed.words) ? parsed.words : null;
    if (!arr) throw new Error('Expected an array or an object with a "words" array.');
    if (!arr.length) throw new Error('No words found.');
    return arr;
  }

  private validateWords(words: any[]) {
    const issues: Array<{ type: string; message: string; lemma?: string; details?: any }> = [];
    const seen = new Set<string>();

    words.forEach((w, i) => {
      const lemma = w?.lemma;
      if (!lemma || typeof lemma !== 'string') {
        issues.push({ type: 'lemma', message: 'Missing lemma string', details: { index: i } });
        return;
      }
      const id = w?.id;
      if (typeof id !== 'number') {
        issues.push({ type: 'id', message: 'Missing numeric id', lemma });
      }
      if (!Array.isArray(w.lessons)) {
        issues.push({ type: 'lessons', message: 'Missing lessons[]', lemma });
      }
      const key = lemma.toLowerCase();
      if (seen.has(key)) {
        issues.push({ type: 'duplicate', message: 'Duplicate lemma within file', lemma });
      } else {
        seen.add(key);
      }
    });

    return { issues, valid: words.length - issues.length, total: words.length };
  }

  private resetMsgs() {
    this.error = '';
    this.importError = '';
    this.importSuccess = '';
    this.issues = [];
    this.hasChecked = false;
    this.validCount = 0;
    this.totalCount = 0;
  }
/// ---------- Audio path rules ----------
private slug(s: string) {
  return String(s || '')
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
private firstLevel(levels: any): string {
  return Array.isArray(levels) && levels.length ? String(levels[0]) : 'B1';
}
private keyPrefix(locale: 'en-GB'|'en-US', level: string, lemma: string) {
  const id = this.slug(lemma);
  const shard = id[0] || '_';
  return `${locale}/${level}/${shard}/${id}/`;
}
private topicKeySegment(topicKey: string | undefined) { return this.slug(topicKey || 'topic'); }
private emptyLike(v: any) { return v === '' || v === null || typeof v === 'undefined'; }

// Return an existing headword entry if present (do NOT create new objects)
private getHeadwordEntry(def: any, loc: 'en-GB'|'en-US') {
  return def?.headwords?.[loc] ?? def?.definition?.[loc]?.headwords ?? null;
}

// Build headword.mp3 using the headword entry's own pos & senseid
private computeHeadwordPath(
  locale: 'en-GB'|'en-US',
  level: string,
  lemma: string,
  entry: { partOfSpeech?: string; senseid?: string; senseId?: string }
) {
  const pos = String(entry?.partOfSpeech || 'other').toLowerCase();
  const sid = String((entry as any)?.senseid || (entry as any)?.senseId || 's1');
  return `${this.keyPrefix(locale, level, lemma)}senses/${pos}/${sid}/headword.mp3`;
}

private fillAudioForWord(docObj: any) {
  const level = this.firstLevel(docObj?.levels);

  // (1) variants phonetics → ipa.mp3 (only if field exists & empty)
  for (const loc of ['en-GB', 'en-US'] as const) {
    const phon = docObj?.variants?.[loc]?.phonetics;
    if (phon && Object.prototype.hasOwnProperty.call(phon, 'audioUrl') && this.emptyLike(phon.audioUrl)) {
      phon.audioUrl = `${this.keyPrefix(loc, level, docObj.lemma)}ipa.mp3`;
    }
  }

  // (2) partsOfSpeech / definitions / headwords / definition audio / examples
  const posArr = Array.isArray(docObj.partsOfSpeech) ? docObj.partsOfSpeech : [];
  posArr.forEach((posEntry: any) => {
    const pos = String(posEntry?.partOfSpeech || 'other').toLowerCase();
    const defs = Array.isArray(posEntry?.definitions) ? posEntry.definitions : [];
    defs.forEach((def: any, defIdx: number) => {
      const senseId = def?.senseId || `s${defIdx + 1}`;

      // (2a) HEADWORDS (simple): if a headword entry exists for a locale, fill headword.mp3
      for (const loc of ['en-GB', 'en-US'] as const) {
        const hw = this.getHeadwordEntry(def, loc);
        if (hw && Object.prototype.hasOwnProperty.call(hw, 'audioUrl') && this.emptyLike(hw.audioUrl)) {
          hw.audioUrl = this.computeHeadwordPath(loc, level, docObj.lemma, hw);
        }
      }

      // (2b) Definition audio — only for locales that exist
      for (const loc of ['en-GB', 'en-US'] as const) {
        const defLoc = def?.definition?.[loc];
        if (defLoc && Object.prototype.hasOwnProperty.call(defLoc, 'audioUrl') && this.emptyLike(defLoc.audioUrl)) {
          defLoc.audioUrl = `${this.keyPrefix(loc, level, docObj.lemma)}senses/${pos}/${senseId}/definition.mp3`;
        }
      }

      // (2c) Examples audio — and create US shells with only links when US array is []
      for (const loc of ['en-GB', 'en-US'] as const) {
        const exArr = def?.examples?.[loc];
        if (!Array.isArray(exArr)) continue;

        if (loc === 'en-US' && exArr.length === 0) {
          const gbArr = def?.examples?.['en-GB'];
          if (Array.isArray(gbArr) && gbArr.length > 0) {
            def.examples['en-US'] = gbArr.map((_: any, idx: number) => ({
              text: '',
              audioUrl: `${this.keyPrefix('en-US', level, docObj.lemma)}senses/${pos}/${senseId}/examples/${idx}.mp3`,
              partOfSpeech: '',
              senseId: '',
            }));
            continue;
          }
        }

        exArr.forEach((ex: any, idx: number) => {
          if (Object.prototype.hasOwnProperty.call(ex, 'audioUrl') && this.emptyLike(ex.audioUrl)) {
            ex.audioUrl = `${this.keyPrefix(loc, level, docObj.lemma)}senses/${pos}/${senseId}/examples/${idx}.mp3`;
          }
        });
      }
    });
  });

  // (3) topics examples (same US-shell behavior)
  const topics = Array.isArray(docObj.topics) ? docObj.topics : [];
  topics.forEach((t: any) => {
    const tkey = this.topicKeySegment(t?.topicKey);
    for (const loc of ['en-GB', 'en-US'] as const) {
      const exArr = t?.examples?.[loc];
      if (!Array.isArray(exArr)) continue;

      if (loc === 'en-US' && exArr.length === 0) {
        const gbArr = t?.examples?.['en-GB'];
        if (Array.isArray(gbArr) && gbArr.length > 0) {
          t.examples['en-US'] = gbArr.map((_: any, idx: number) => ({
            text: '',
            audioUrl: `${this.keyPrefix('en-US', level, docObj.lemma)}topics/${tkey}/examples/${idx}.mp3`,
            partOfSpeech: '',
            senseId: '',
          }));
          continue;
        }
      }

      exArr.forEach((ex: any, idx: number) => {
        if (Object.prototype.hasOwnProperty.call(ex, 'audioUrl') && this.emptyLike(ex.audioUrl)) {
          ex.audioUrl = `${this.keyPrefix(loc, level, docObj.lemma)}topics/${tkey}/examples/${idx}.mp3`;
        }
      });
    }
  });
}

  
}