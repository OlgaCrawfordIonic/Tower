// src/app/kvoutput/wordslessons-kv-output/wordslessons-kv-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';

import { LemmaLoaderService } from '../contentoutput/lemma-loader.service'; // your working KV word loader
import { WordslessonKvLoaderService } from './wordslesson-kv-loader.service';

import { WordDoc } from '../data/lexamatewords.model';
import { Lesson } from '../LessonsOutput/lesson.model';

@Injectable({ providedIn: 'root' })
export class WordslessonsKvStateService {
  private lessonSubject = new BehaviorSubject<Lesson | null>(null);
  readonly lesson$ = this.lessonSubject.asObservable();

  private wordsSubject = new BehaviorSubject<WordDoc[]>([]);
  readonly words$ = this.wordsSubject.asObservable();

  private wordIndexSubject = new BehaviorSubject<Map<string, WordDoc>>(new Map());
  readonly wordIndex$ = this.wordIndexSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string>('');
  readonly error$ = this.errorSubject.asObservable();

  constructor(
    private lessonLoader: WordslessonKvLoaderService,
    private lemmaLoader: LemmaLoaderService
  ) {}

  /** Call this from the page and SUBSCRIBE. */
  loadLesson$(lessonNo: number, level = 'B1'): Observable<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next('');

    return from(this.lessonLoader.loadLesson(lessonNo, level) as Promise<Lesson>).pipe(
      switchMap((lesson) => {
        this.lessonSubject.next(lesson);

        const lemmas = this.collectAllLemmas(lesson);
        return from(this.loadWordsForLesson(lemmas, level)).pipe(
          tap((wordDocs) => {
            this.wordsSubject.next(wordDocs);
            const idx = new Map<string, WordDoc>();
            for (const w of wordDocs) idx.set(String(w.lemma), w);
            this.wordIndexSubject.next(idx);

            console.log(
              '[WordslessonsKvStateService] words loaded:',
              wordDocs.length,
              wordDocs.map((w) => w.lemma)
            );
          }),
          map(() => void 0)
        );
      }),
      catchError((e: unknown) => {
        const msg = e instanceof Error ? e.message : String(e);
        this.errorSubject.next(msg);
        this.lessonSubject.next(null);
        this.wordsSubject.next([]);
        this.wordIndexSubject.next(new Map());
        return of(void 0);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  private collectAllLemmas(lesson: Lesson): string[] {
    const s = new Set<string>();

    (lesson.lemmas?.part1 ?? []).forEach((x) => x && s.add(String(x)));
    (lesson.lemmas?.part2 ?? []).forEach((x) => x && s.add(String(x)));

    for (const part of ['part1', 'part2'] as const) {
      for (const variety of ['british', 'american'] as const) {
        const aw = lesson.text?.[part]?.[variety]?.activeWords ?? [];
        for (const w of aw) if (w?.lemma) s.add(String(w.lemma));
      }
    }

    return [...s].map((x) => x.trim()).filter(Boolean);
  }

  private async loadWordsForLesson(lemmas: string[], level: string): Promise<WordDoc[]> {
    const unique = [...new Set(lemmas.map((x) => String(x).trim()).filter(Boolean))];
    const out: WordDoc[] = [];

    // sequential is fine for small lesson lists; avoids hammering your worker
    for (const lemma of unique) {
      try {
        const doc = await this.lemmaLoader.load(lemma, level);
        if (doc) out.push(doc as WordDoc);
      } catch (e) {
        console.warn('[WordslessonsKvStateService] KV word failed:', lemma, e);
      }
    }

    return out;
  }
}
