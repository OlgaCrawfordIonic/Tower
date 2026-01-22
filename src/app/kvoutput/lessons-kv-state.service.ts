import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { catchError, finalize, map, switchMap, tap, toArray, mergeMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { WordDoc } from '../data/lexamatewords.model';
import { LemmaLoaderService } from '../contentoutput/lemma-loader.service';
import { LessonLoaderService } from '../kvoutput/lesson-kv-loader.service';

// ---------- Types (match your KV lesson JSON) ----------
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
  lemmas: { part1: string[]; part2: string[] };
  text: {
    part1: Record<Variety, LessonTextPart>;
    part2: Record<Variety, LessonTextPart>;
  };
  // optional extra fields in your KV JSON are fine
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class LessonsKvStateService {
  private defaultLevel = environment.defaultLevel;

  private lessonSubject = new BehaviorSubject<Lesson | null>(null);
  readonly lesson$ = this.lessonSubject.asObservable();

  private wordIndexSubject = new BehaviorSubject<Map<string, WordDoc>>(new Map());
  readonly wordIndex$ = this.wordIndexSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string>('');
  readonly error$ = this.errorSubject.asObservable();

  constructor(
    private lessonLoader: LessonLoaderService,
    private lemmaLoader: LemmaLoaderService
  ) {}

  loadLesson$(lessonNo: number, level = this.defaultLevel): Observable<void> {
    this.loadingSubject.next(true);
    this.errorSubject.next('');

    return from(this.lessonLoader.loadLesson(lessonNo, level) as Promise<Lesson>).pipe(
      tap((lesson) => this.lessonSubject.next(lesson)),

      switchMap((lesson) => {
        const lemmas = this.collectAllLemmas(lesson);

        // Load WordDocs from KV (parallel with limited concurrency)
        return from(lemmas).pipe(
          mergeMap(
            (lemma) =>
              from(this.lemmaLoader.load(lemma, level) as Promise<WordDoc>).pipe(
                catchError((err) => {
                  console.warn('[LessonsKvState] word load failed:', lemma, err);
                  return of(null);
                })
              ),
            4 // concurrency
          ),
          toArray(),
          map((docs) => docs.filter(Boolean) as WordDoc[]),
          map((docs) => {
            const m = new Map<string, WordDoc>();
            for (const d of docs) m.set(this.norm(d.lemma), d);
            return m;
          })
        );
      }),

      tap((wordIndex) => {
        this.wordIndexSubject.next(wordIndex);
        console.log('[LessonsKvState] words loaded:', wordIndex.size, [...wordIndex.keys()]);
      }),

      map(() => void 0),

      catchError((e: any) => {
        this.errorSubject.next(e?.message ?? String(e));
        this.lessonSubject.next(null);
        this.wordIndexSubject.next(new Map());
        return of(void 0);
      }),

      finalize(() => this.loadingSubject.next(false))
    );
  }

  private collectAllLemmas(lesson: Lesson): string[] {
    const s = new Set<string>();

    (lesson.lemmas?.part1 ?? []).forEach((x) => x && s.add(this.norm(x)));
    (lesson.lemmas?.part2 ?? []).forEach((x) => x && s.add(this.norm(x)));

    for (const part of ['part1', 'part2'] as PartKey[]) {
      for (const variety of ['british', 'american'] as Variety[]) {
        const aw = lesson.text?.[part]?.[variety]?.activeWords ?? [];
        for (const w of aw) {
          if (w?.lemma) s.add(this.norm(w.lemma));
        }
      }
    }

    return [...s].filter(Boolean);
  }

  private norm(x: any) {
    return String(x ?? '').trim().toLowerCase();
  }

  // handy snapshot getter (optional)
  wordIndexSnapshot() {
    return this.wordIndexSubject.value;
  }
}
