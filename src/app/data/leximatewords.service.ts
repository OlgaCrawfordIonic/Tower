

import { Injectable } from '@angular/core';
import { db } from '../firebase';
import {
  doc, setDoc, serverTimestamp, getDoc, writeBatch, query,
  collection, where, getDocs, DocumentReference
} from 'firebase/firestore';
import { WordDoc } from '../data/lexamatewords.model';
import { wordDocId } from '../utils/ids';

@Injectable({ providedIn: 'root' })
export class LeximatewordsService {
  private colPath = 'words';

  private refForLemma(lemma: string): DocumentReference {
    return doc(db, this.colPath, wordDocId(lemma));
  }

  /** Upsert (create or merge) a word document. Idempotent by lemma. */
  async upsertWord(docIn: WordDoc): Promise<void> {
    const ref = this.refForLemma(docIn.lemma);
    await setDoc(ref, {
      ...docIn,
      language: 'en',
      updatedAt: serverTimestamp(),
      createdAt: (docIn as any).createdAt ?? serverTimestamp(),
    }, { merge: true });
  }

  /** Read a word by lemma. */
  async getWord(lemma: string): Promise<WordDoc | null> {
    const snap = await getDoc(this.refForLemma(lemma));
    return snap.exists() ? (snap.data() as WordDoc) : null;
  }

  /** Query example: by level + topic. */
  async listByLevelAndTopic(level: string, topic: string): Promise<WordDoc[]> {
    const q = query(
      collection(db, this.colPath),
      where('levels', 'array-contains', level),
      where('topics', 'array-contains', topic),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map(d => d.data() as WordDoc);
  }

  /** Batch import many words safely (500 ops per batch). */
  async batchImport(words: WordDoc[]): Promise<void> {
    const CHUNK = 450; // keep below 500 to be safe
    for (let i = 0; i < words.length; i += CHUNK) {
      const batch = writeBatch(db);
      for (const w of words.slice(i, i + CHUNK)) {
        const ref = this.refForLemma(w.lemma);
        batch.set(ref, {
          ...w,
          language: 'en',
          updatedAt: serverTimestamp(),
          createdAt: (w as any).createdAt ?? serverTimestamp(),
        }, { merge: true });
      }
      await batch.commit();
    }
  }
}
