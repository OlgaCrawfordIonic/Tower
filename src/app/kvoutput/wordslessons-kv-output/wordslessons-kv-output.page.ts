// src/app/kvoutput/wordslessons-kv-output/wordslessons-kv-output.page.ts
import { Component, DestroyRef, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonSegment, IonSegmentButton, IonLabel,
  IonButton, IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { playCircleOutline, pauseCircleOutline } from 'ionicons/icons';

import { environment } from '../../../environments/environment';
import { AudioService } from '../../contentoutput/audio';

import { WordslessonsKvStateService } from '../wordslessons-kv-state.service';
import { WordDoc } from '../../data/lexamatewords.model';
import { Lesson, FindtheWord, LessonTextPart, Variety, PartKey } from '../../LessonsOutput/lesson.model';

type Locale = 'en-GB' | 'en-US';

type Segment =
  | { type: 'text'; text: string }
  | { type: 'kw'; label: string; ref: FindtheWord };

@Component({
  selector: 'app-wordslessons-kv-output',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonSegment, IonSegmentButton, IonLabel,
    IonButton, IonIcon
  ],
  templateUrl: './wordslessons-kv-output.page.html',
  styleUrls: ['./wordslessons-kv-output.page.scss'],
})
export class WordslessonsKvOutputPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly state = inject(WordslessonsKvStateService);
  private readonly audio = inject(AudioService);

  // UI state
  readonly variety = signal<Variety>('british');
  readonly part = signal<PartKey>('part1');

  readonly loading = signal<boolean>(true);
  readonly error = signal<string>('');

  // data cache from BehaviorSubjects
  private _lesson = signal<Lesson | null>(null);
  private _wordIndex = signal<Map<string, WordDoc>>(new Map());

  // bubble (no audio)
  activeWord: string | null = null;
  activeShortDesc = '';
  activeKey = '';

  // config
  private level = environment.defaultLevel || 'B1';
  private r2PublicBase = (environment.r2PublicBase || 'https://audio.lingoapp.io/').replace(/\/?$/, '/');

  constructor() {
    addIcons({ playCircleOutline, pauseCircleOutline });

    // bridge service observables -> signals
    this.state.lesson$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((l) => this._lesson.set(l));
    this.state.wordIndex$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((m) => this._wordIndex.set(m));
    this.state.loading$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((v) => this.loading.set(v));
    this.state.error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((e) => this.error.set(e));
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pm) => {
        const raw =
          pm.get('lesson') ??
          pm.get('id') ??
          this.route.snapshot.queryParamMap.get('lesson');

        const n = Number(raw ?? 1);
        const lessonNo = Number.isFinite(n) && n > 0 ? n : 1;

        this.clearDesc();

        // IMPORTANT: must SUBSCRIBE or nothing runs
        this.state.loadLesson$(lessonNo, this.level)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe();
      });
  }

  // template expects lesson()
  readonly lesson = computed(() => this._lesson());

  readonly locale = computed<Locale>(() =>
    this.variety() === 'british' ? 'en-GB' : 'en-US'
  );

  readonly currentTextPart = computed<LessonTextPart>(() => {
    const l = this.lesson();
    if (!l) return { textWithAudio: { text: '', audioUrl: '' }, activeWords: [] };
    return l.text?.[this.part()]?.[this.variety()]
      ?? { textWithAudio: { text: '', audioUrl: '' }, activeWords: [] };
  });

  readonly segments = computed<Segment[]>(() => {
    const tp = this.currentTextPart();
    return this.buildSegments(tp?.textWithAudio?.text ?? '', tp?.activeWords ?? []);
  });

  // lesson paragraph audio (ONLY this)
  readonly lessonTextAudioKey = computed<string | null>(() => {
    const key = this.currentTextPart()?.textWithAudio?.audioUrl ?? '';
    return key.trim() ? key : null;
  });

  playLessonText() {
    const key = this.lessonTextAudioKey();
    if (!key) return;
    this.audio.play(this.r2PublicBase + key);
  }

  isPlayingLessonText() {
    const key = this.lessonTextAudioKey();
    if (!key) return false;
    return this.audio.isPlaying(this.r2PublicBase + key);
  }

  // segment click
  showDesc(ref: FindtheWord) {
    const loc = this.locale();
    this.activeKey = this.keyOf(ref);
    this.activeWord = this.resolveDisplay(ref, loc);
    this.activeShortDesc = this.resolveShortDefinition(ref, loc);
  }

  clearDesc() {
    this.activeWord = null;
    this.activeShortDesc = '';
    this.activeKey = '';
  }

  setVariety(v: any) {
    if (v === 'british' || v === 'american') {
      this.variety.set(v);
      this.clearDesc();
    }
  }

  setPart(p: any) {
    if (p === 'part1' || p === 'part2') {
      this.part.set(p);
      this.clearDesc();
    }
  }

  keyOf(ref: FindtheWord) {
    return `${ref.lemma}::${ref.pos}::${ref.senseId}`;
  }

  // ---------- parsing text into clickable segments ----------
  private buildSegments(text: string, activeWords: FindtheWord[]): Segment[] {
    if (!text) return [];
    if (!activeWords?.length) return [{ type: 'text', text }];

    const surfaceMap = new Map<string, FindtheWord>();
    for (const w of activeWords) {
      const k = String(w.surface ?? '').toLowerCase();
      if (k && !surfaceMap.has(k)) surfaceMap.set(k, w);
    }

    const surfaces = [...surfaceMap.values()].map(x => x.surface).sort((a, b) => b.length - a.length);
    if (!surfaces.length) return [{ type: 'text', text }];

    const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\b(${surfaces.map(escape).join('|')})\\b`, 'gi');

    const out: Segment[] = [];
    let last = 0;
    let m: RegExpExecArray | null;

    while ((m = re.exec(text)) !== null) {
      const label = m[1];
      const start = m.index;

      if (start > last) out.push({ type: 'text', text: text.slice(last, start) });

      const ref = surfaceMap.get(label.toLowerCase());
      out.push(ref ? { type: 'kw', label, ref } : { type: 'text', text: label });

      last = start + label.length;
    }

    if (last < text.length) out.push({ type: 'text', text: text.slice(last) });
    return out;
  }

  // ---------- word lookup ----------
  private resolveShortDefinition(ref: FindtheWord, locale: Locale): string {
    const doc = this._wordIndex().get(ref.lemma);
    if (!doc?.partsOfSpeech?.length) return '(No definition found)';

    const posNeed = String(ref.pos ?? '').toLowerCase();
    const senseNeed = String(ref.senseId ?? '').toLowerCase();

    const posBlock = doc.partsOfSpeech.find(p => String(p.partOfSpeech).toLowerCase() === posNeed);
    const sense = posBlock?.definitions?.find(d => String(d.senseId).toLowerCase() === senseNeed);

    const defLoc =
      sense?.definition?.[locale] ??
      sense?.definition?.['en-GB'] ??
      sense?.definition?.['en-US'];

    return defLoc?.text?.trim() || '(No definition found)';
  }

  private resolveDisplay(ref: FindtheWord, locale: Locale): string {
    const doc = this._wordIndex().get(ref.lemma);

    const fallback =
      locale === 'en-GB'
        ? (doc?.english || doc?.lemma || ref.lemma)
        : (doc?.american || doc?.lemma || ref.lemma);

    if (!doc?.partsOfSpeech?.length) return fallback;

    const posNeed = String(ref.pos ?? '').toLowerCase();
    const senseNeed = String(ref.senseId ?? '').toLowerCase();

    const posBlock = doc.partsOfSpeech.find(p => String(p.partOfSpeech).toLowerCase() === posNeed);
    const sense = posBlock?.definitions?.find(d => String(d.senseId).toLowerCase() === senseNeed);

    const defLoc =
      sense?.definition?.[locale] ??
      sense?.definition?.['en-GB'] ??
      sense?.definition?.['en-US'];

    // if your word JSON includes headwords inside definition locale objects
    const headword =
      defLoc?.headwords?.[locale]?.headword ??
      defLoc?.headwords?.['en-GB']?.headword ??
      defLoc?.headwords?.['en-US']?.headword ??
      null;

    return headword || fallback;
  }

  trackSeg = (_: number, s: Segment) =>
    s.type === 'text'
      ? `t:${s.text}`
      : `k:${s.ref.lemma}:${s.ref.pos}:${s.ref.senseId}:${s.label}`;
}
