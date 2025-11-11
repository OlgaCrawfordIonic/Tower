// src/app/services/level-import.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  writeBatch, doc, serverTimestamp, arrayUnion, DocumentReference
} from 'firebase/firestore';
import { db } from '../firebase';
import { wordDocId } from '../utils/ids';
import { WordDoc, CEFR } from '../data/lexamatewords.model';

type LevelFile = Record<string, string[]>; // e.g. { "A1": ["word", ...] }

@Injectable({ providedIn: 'root' })
export class LevelImportService {
  constructor(private http: HttpClient) {}

  private refForLemma(lemma: string): DocumentReference {
    return doc(db, 'words', wordDocId(lemma));
  }

 /* private baseDoc(lemma: string): Omit<WordDoc, 'createdAt'|'updatedAt'> {
    return {
      lemma,
      language: 'en',
      lessons: [0],
      shortDescription: '',
      levels: [],             // will be filled by arrayUnion(level)
      topics: [],
      shared: { partsOfSpeech: [] },
      variants: {},
    };
  }

   Import from an assets JSON file with { "<LEVEL>": ["word", ...] } 
  async importFromAssets(level: CEFR, assetPath: string): Promise<number> {
    const json = await this.http.get<LevelFile>(assetPath).toPromise();
    const list = json?.[level];
    if (!Array.isArray(list) || !list.length) return 0;

    const lemmas = Array.from(new Set(list.map(s => s.trim()).filter(Boolean)));
    await this.writeInBatches(lemmas, level);
    return lemmas.length;
  }

s Import from a user-selected file (e.g., via <input type="file">) 
  async importFromFile(level: CEFR, file: File): Promise<number> {
    const text = await file.text();
    const json = JSON.parse(text) as LevelFile;
    const list = json?.[level];
    if (!Array.isArray(list) || !list.length) return 0;

    const lemmas = Array.from(new Set(list.map(s => s.trim()).filter(Boolean)));
    await this.writeInBatches(lemmas, level);
    return lemmas.length;
  }

  private async writeInBatches(lemmas: string[], level: CEFR) {
    const CHUNK = 450; // Firestore batch soft limit
    for (let i = 0; i < lemmas.length; i += CHUNK) {
      const slice = lemmas.slice(i, i + CHUNK);
      const batch = writeBatch(db);

      for (const lemma of slice) {
        const ref = this.refForLemma(lemma);
        const base = this.baseDoc(lemma);

        batch.set(ref, {
          ...base,
          levels: arrayUnion(level),          // add only this level
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });                  // safe re-runs; no overwrites
      }

      await batch.commit();
    }
  }*/
}
