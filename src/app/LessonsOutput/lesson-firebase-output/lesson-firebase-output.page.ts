import { Component, computed, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonSegment, IonSegmentButton, IonLabel,
  IonCard, IonButton
} from '@ionic/angular/standalone';

import { WordDoc } from '../../data/lexamatewords.model'; // adjust
import {
  LessonStateService,
  LessonTextPart,
  FindtheWord,
  Variety,
  PartKey,
  Locale
} from '../lesson-state.service';

// Segments used by your HTML
type Segment =
  | { type: 'text'; text: string }
  | { type: 'kw'; label: string; ref: FindtheWord };

@Component({
  selector: 'app-lesson-firebase-output',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonSegment, IonSegmentButton, IonLabel,
    IonCard, IonButton
  ],
  templateUrl: './lesson-firebase-output.page.html',
  styleUrls: ['./lesson-firebase-output.page.scss'],
})
export class LessonFirebaseOutputPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly state = inject(LessonStateService);

  // UI state
  readonly variety = signal<Variety>('british');
  readonly part = signal<PartKey>('part1');

  // Bubble UI
  activeWord: string | null = null;
  activeShortDesc = '';
  activeKey = '';

  // Local caches (signals) bridged from BehaviorSubjects
  private readonly _lesson = signal<any>(null);
  private readonly _wordIndex = signal<Map<string, WordDoc>>(new Map());

  constructor() {
    this.state.lesson$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(l => this._lesson.set(l));

    this.state.wordIndex$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(m => this._wordIndex.set(m));
  }

  ngOnInit(): void {
    
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(pm => {
        const raw =
          pm.get('lesson')
          ?? pm.get('id')
          ?? this.route.snapshot.queryParamMap.get('lesson');

        const n = Number(raw ?? 1);
        const lessonNo = Number.isFinite(n) && n > 0 ? n : 1;

        this.clearDesc();

        // IMPORTANT: this loads BOTH lesson + words
        this.state.loadLesson$(lessonNo)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => console.log('[LessonFirebaseOutput] load done for lesson', lessonNo),
            error: (e) => console.error('[LessonFirebaseOutput] load failed', e),
          });
      });
  }

  // ---------- Computeds used by your HTML ----------
  readonly locale = computed<Locale>(() =>
    this.variety() === 'british' ? 'en-GB' : 'en-US'
  );

  readonly currentLesson = computed(() => this._lesson() ?? null);

  readonly currentTextPart = computed<LessonTextPart>(() => {
    const lesson = this.currentLesson();
    if (!lesson) return { textWithAudio: { text: '', audioUrl: '' }, activeWords: [] };
    return lesson.text?.[this.part()]?.[this.variety()]
      ?? { textWithAudio: { text: '', audioUrl: '' }, activeWords: [] };
  });

  readonly introSegmentsLesson1Part1 = computed<Segment[]>(() => {
    const tp = this.currentTextPart();
    return this.buildSegments(tp?.textWithAudio?.text ?? '', tp?.activeWords ?? []);
  });

  // ---------- UI handlers ----------
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

  clearDesc() {
    this.activeWord = null;
    this.activeShortDesc = '';
    this.activeKey = '';
  }

  keyOf(ref: FindtheWord) {
    return `${ref.lemma}::${ref.pos}::${ref.senseId}`;
  }

  // Template calls this
  onKeywordClick(seg: Segment) {
    if (seg.type !== 'kw') return;

    const locale = this.locale();

    // DEBUG: prove we have the word doc
    const doc = this._wordIndex().get(this.norm(seg.ref.lemma));
    console.log('[click]', seg.ref, 'doc?', !!doc, doc?.lemma);

    const display = this.resolveDisplay(seg.ref, locale) ?? seg.label;
    const def = this.resolveShortDefinition(seg.ref, locale);

    this.activeWord = display;
    this.activeShortDesc = def || '(No definition found)';
    this.activeKey = this.keyOf(seg.ref);
  }

  // ---------- Core logic ----------
  private buildSegments(text: string, activeWords: FindtheWord[]): Segment[] {
    if (!text) return [];
    if (!activeWords?.length) return [{ type: 'text', text }];

    const surfaceMap = new Map<string, FindtheWord>();
    for (const w of activeWords) {
      const key = this.norm(w.surface);
      if (key && !surfaceMap.has(key)) surfaceMap.set(key, w);
    }

    const surfaces = [...surfaceMap.values()]
      .map(x => x.surface)
      .sort((a, b) => b.length - a.length);

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

      const ref = surfaceMap.get(this.norm(label));
      out.push(ref ? { type: 'kw', label, ref } : { type: 'text', text: label });

      last = start + label.length;
    }

    if (last < text.length) out.push({ type: 'text', text: text.slice(last) });
    return out;
  }

  private resolveShortDefinition(ref: FindtheWord, locale: Locale): string {
    const doc = this._wordIndex().get(this.norm(ref.lemma));
    if (!doc?.partsOfSpeech?.length) return '(No definition found)';

    const posNeed = this.norm(this.normalizePos(ref.pos));
    const senseNeed = this.norm(ref.senseId);

    const posBlock = doc.partsOfSpeech.find(p => this.norm(p.partOfSpeech) === posNeed);
    if (!posBlock) {
      console.warn('[def] pos not found', { lemma: ref.lemma, posNeed, available: doc.partsOfSpeech.map(p => p.partOfSpeech) });
      return '(No definition found)';
    }

    const sense = posBlock.definitions.find(d => this.norm(d.senseId) === senseNeed);
    if (!sense) {
      console.warn('[def] sense not found', { lemma: ref.lemma, posNeed, senseNeed, available: posBlock.definitions.map(d => d.senseId) });
      return '(No definition found)';
    }

    const defLoc =
      sense.definition?.[locale]
      ?? sense.definition?.['en-GB']
      ?? sense.definition?.['en-US'];

    return defLoc?.text?.trim() || '(No definition found)';
  }

  private resolveDisplay(ref: FindtheWord, locale: Locale): string {
    const doc = this._wordIndex().get(this.norm(ref.lemma));

    const fallback =
      locale === 'en-GB'
        ? (doc?.english || doc?.lemma || ref.lemma)
        : (doc?.american || doc?.lemma || ref.lemma);

    if (!doc?.partsOfSpeech?.length) return fallback;

    const posNeed = this.norm(this.normalizePos(ref.pos));
    const senseNeed = this.norm(ref.senseId);

    const posBlock = doc.partsOfSpeech.find(p => this.norm(p.partOfSpeech) === posNeed);
    const sense = posBlock?.definitions.find(d => this.norm(d.senseId) === senseNeed);

    const defLoc =
      sense?.definition?.[locale]
      ?? sense?.definition?.['en-GB']
      ?? sense?.definition?.['en-US'];

    const headword =
      defLoc?.headwords?.[locale]?.headword
      ?? defLoc?.headwords?.['en-GB']?.headword
      ?? defLoc?.headwords?.['en-US']?.headword
      ?? null;

    return headword || fallback;
  }

  // small helper: fixes common “Adjectives” vs “adjective”
  private normalizePos(pos: string): string {
    const p = this.norm(pos);
    const map: Record<string, string> = {
      nouns: 'noun',
      verbs: 'verb',
      adjectives: 'adjective',
      adverbs: 'adverb',
    };
    return map[p] ?? p;
  }

  private norm(s: string) {
    return String(s ?? '').trim().toLowerCase();
  }

  trackSeg = (_: number, s: Segment) =>
    s.type === 'text' ? `t:${s.text}` : `k:${s.ref.lemma}:${s.ref.pos}:${s.ref.senseId}:${s.label}`;
}
