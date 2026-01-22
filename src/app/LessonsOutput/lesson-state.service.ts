// src/app/LessonsOutput/lesson-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, map, finalize, catchError } from 'rxjs';

import { WordDoc } from '../data/lexamatewords.model'; // adjust path
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

// ---------- Lesson Types (your CURRENT model) ----------
export type Variety = 'american' | 'british';
export type PartKey = 'part1' | 'part2';
export type Locale = 'en-GB' | 'en-US';
export type Pos = string;

export interface FindtheWord {
  surface: string;
  lemma: string;
  pos: Pos;
  senseId: string;
}
export interface TextWithAudio {
  text: string;
  audioUrl?: string | null;
}
export interface LessonTextPart {
  textWithAudio: TextWithAudio;
  activeWords: FindtheWord[];
}
export interface Lesson {
  lesson: number;
  lemmas: {
    part1: string[];
    part2: string[];
  };
  text: {
    part1: Record<Variety, LessonTextPart>;
    part2: Record<Variety, LessonTextPart>;
  };
}

@Injectable({ providedIn: 'root' })
export class LessonStateService {
  private readonly db = getFirestore();
  private readonly DEBUG = true;

  private readonly _loading = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading.asObservable();

  private readonly _error = new BehaviorSubject<string>('');
  readonly error$ = this._error.asObservable();

  private readonly _lesson = new BehaviorSubject<Lesson | null>(null);
  readonly lesson$ = this._lesson.asObservable();

  private readonly _words = new BehaviorSubject<WordDoc[]>([]);
  readonly words$ = this._words.asObservable();

  private readonly _wordIndex = new BehaviorSubject<Map<string, WordDoc>>(new Map());
  readonly wordIndex$ = this._wordIndex.asObservable();

  loadLesson$(lessonNo: number): Observable<void> {
    this._loading.next(true);
    this._error.next('');

    return from(this.loadInternal(lessonNo)).pipe(
      map(() => void 0),
      catchError((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        this._error.next(msg);
        if (this.DEBUG) console.error('[LessonStateService] load error:', err);
        throw err;
      }),
      finalize(() => this._loading.next(false)),
    );
  }

  private async loadInternal(lessonNo: number) {
    // 1) lesson
    const lessonRef = doc(this.db, 'EnglishB1Lessons', String(lessonNo));
    const snap = await getDoc(lessonRef);
    if (!snap.exists()) throw new Error(`Lesson ${lessonNo} not found in EnglishB1Lessons`);

    const lesson = snap.data() as Lesson;
    this._lesson.next(lesson);

    // 2) collect lemmas needed
    const lemmas = this.collectAllLemmas(lesson);

    // 3) words
    const wordDocs = await this.fetchWordsByLemma(lemmas);
    this._words.next(wordDocs);

    // 4) index by normalized lemma
    const index = new Map<string, WordDoc>();
    for (const w of wordDocs) index.set(this.norm(w.lemma), w);
    this._wordIndex.next(index);

    if (this.DEBUG) {
      console.log('[LessonStateService] lesson loaded:', lessonNo, lesson);
      console.log('[LessonStateService] lemmas needed:', lemmas);
      console.log('[LessonStateService] words loaded:', wordDocs.length, wordDocs.map(w => w.lemma));
    }
  }

  private collectAllLemmas(lesson: Lesson): string[] {
    const s = new Set<string>();

    (lesson.lemmas?.part1 ?? []).forEach(x => x && s.add(this.norm(x)));
    (lesson.lemmas?.part2 ?? []).forEach(x => x && s.add(this.norm(x)));

    // most reliable: activeWords
    for (const part of ['part1', 'part2'] as PartKey[]) {
      for (const variety of ['british', 'american'] as Variety[]) {
        const aw = lesson.text?.[part]?.[variety]?.activeWords ?? [];
        for (const w of aw) {
          if (w?.lemma) s.add(this.norm(w.lemma));
        }
      }
    }

    return [...s];
  }

 


private async fetchWordsByLemma(lemmas: string[]): Promise<WordDoc[]> {
  const unique = [...new Set((lemmas ?? []).map(x => this.norm(x)).filter(Boolean))];

  console.log('[fetchWordsByLemma] requested lemmas:', unique);
  if (!unique.length) return [];

  const out: WordDoc[] = [];

  // ---- A) Try doc-id lookup first (works if doc id == lemma)
  const missing: string[] = [];
  for (const lemma of unique) {
    const s = await getDoc(doc(this.db, 'EnglishB1words', lemma));
    if (s.exists()) {
      out.push(s.data() as WordDoc);
    } else {
      missing.push(lemma);
    }
  }

  console.log('[fetchWordsByLemma] docId hits:', out.length, 'missing:', missing);

  // ---- B) Fallback: field query for docs whose IDs aren’t lemmas
  // Firestore IN limit is 10 values
  const CHUNK = 10;

  for (let i = 0; i < missing.length; i += CHUNK) {
    const slice = missing.slice(i, i + CHUNK);

    console.log('[fetchWordsByLemma] querying field lemma IN:', slice);

    const q = query(
      collection(this.db, 'EnglishB1Words'),
      where('lemma', 'in', slice)
    );

    const snap = await getDocs(q);
    console.log('[fetchWordsByLemma] IN query returned:', snap.size);

    snap.forEach(d => out.push(d.data() as WordDoc));
  }

  // De-dupe just in case fallback returns something already loaded
  const byLemma = new Map(out.map(w => [this.norm((w as any).lemma), w]));
  const final = [...byLemma.values()];

  console.log('[fetchWordsByLemma] final loaded:', final.length, final.map(w => (w as any).lemma));
  return final;
}


  private norm(s: string) {
    return String(s ?? '').trim().toLowerCase();
  }
}
