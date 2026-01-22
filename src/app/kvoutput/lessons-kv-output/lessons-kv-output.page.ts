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
import { LessonLoaderService } from '../lesson-kv-loader.service';

// ------------------ Types (match your KV lesson JSON) ------------------

type Variety = 'american' | 'british';
type PartKey = 'part1' | 'part2';
type Locale = 'en-GB' | 'en-US';

type FindtheWord = {
  surface: string;
  lemma: string;
  pos: string;
  senseId: string;
};

type TextWithAudio = {
  text: string;
  audioUrl?: string | null; // KV stores KEY like "en-GB/B1/v1/lessons/..."
};

type LessonTextPart = {
  textWithAudio: TextWithAudio;
  activeWords: FindtheWord[];
};

type Lesson = {
  lesson: number;
  lemmas: {
    part1: string[];
    part2: string[];
  };
  text: {
    part1: Record<Variety, LessonTextPart>;
    part2: Record<Variety, LessonTextPart>;
  };
  // KV doc may include these extra fields; we ignore safely
  [k: string]: any;
};

type Segment =
  | { type: 'text'; text: string }
  | { type: 'kw'; label: string; ref: FindtheWord };

@Component({
  selector: 'app-lessons-kv-output',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonSegment, IonSegmentButton, IonLabel,
    IonButton, IonIcon
  ],
  templateUrl: './lessons-kv-output.page.html',
  styleUrls: ['./lessons-kv-output.page.scss'],
})
export class LessonsKvOutputPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly lessonKV = inject(LessonLoaderService);
  private readonly audio = inject(AudioService);

  // UI state
  readonly variety = signal<Variety>('british');
  readonly part = signal<PartKey>('part1');

  // loading
  readonly loading = signal(false);
  readonly error = signal<string>('');

  // KV lesson loaded
  readonly lesson = signal<Lesson | null>(null);

  // Bubble UI (definition text only)
  activeWord: string | null = null;
  activeShortDesc = '';
  activeKey = '';

  constructor() {
    addIcons({ playCircleOutline, pauseCircleOutline });
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const raw =
          this.route.snapshot.paramMap.get('lesson') ??
          this.route.snapshot.paramMap.get('id') ??
          this.route.snapshot.queryParamMap.get('lesson') ??
          '1';

        const n = Number(raw);
        const lessonNo = Number.isFinite(n) && n > 0 ? n : 1;

        this.clearDesc();
        void this.loadLessonFromKV(lessonNo);
      });
  }

  private async loadLessonFromKV(lessonNo: number) {
    this.loading.set(true);
    this.error.set('');

    try {
      const level = environment.defaultLevel ?? 'B1';

      // Option A: direct key (matches your requirement)
      const key = this.lessonKV.makeKey(level, lessonNo);
      const data = await this.lessonKV.loadLessonByKey(key);

      // Option B: if you implement /api/lesson
      // const data = await this.lessonKV.loadLesson(lessonNo, level);

      this.lesson.set(data as Lesson);

      console.log('[LessonsKvOutput] KV lesson loaded:', key, data);
    } catch (e: any) {
      this.error.set(e?.message ?? String(e));
      this.lesson.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  // ---------- Computeds used by template ----------
  readonly locale = computed<Locale>(() =>
    this.variety() === 'british' ? 'en-GB' : 'en-US'
  );

  readonly currentTextPart = computed<LessonTextPart>(() => {
    const l = this.lesson();
    if (!l) return { textWithAudio: { text: '', audioUrl: '' }, activeWords: [] };

    const p = this.part();
    const v = this.variety();

    return l.text?.[p]?.[v] ?? { textWithAudio: { text: '', audioUrl: '' }, activeWords: [] };
  });

  readonly segments = computed<Segment[]>(() => {
    const tp = this.currentTextPart();
    return this.buildSegments(tp?.textWithAudio?.text ?? '', tp?.activeWords ?? []);
  });

  readonly lessonTextAudioKey = computed<string | null>(() => {
    const key = this.currentTextPart()?.textWithAudio?.audioUrl ?? null;
    return key && String(key).trim() ? String(key).trim() : null;
  });

  // ---------- lesson text audio ----------
  private fullAudioUrlFromKey(key: string): string {
    const base = String(environment.r2PublicBase || '').replace(/\/+$/, '');
    const cleanKey = String(key).replace(/^\/+/, '');
    return `${base}/${cleanKey}`;
  }

  isPlayingLessonText(): boolean {
    const key = this.lessonTextAudioKey();
    if (!key) return false;
    return this.audio.isPlaying(this.fullAudioUrlFromKey(key));
  }

  playLessonText(): void {
    const key = this.lessonTextAudioKey();
    if (!key) return;
    this.audio.play(this.fullAudioUrlFromKey(key));
  }

  // ---------- UI handlers ----------
  setVariety(v: unknown) {
    if (v === 'british' || v === 'american') {
      this.variety.set(v);
      this.clearDesc();
    }
  }

  setPart(p: unknown) {
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

  // Your template calls this directly:
  showDesc(ref: FindtheWord) {
    // KV lesson doesn’t include word definitions; only references.
    // So bubble shows surface + a placeholder, unless you also fetch lemma KV/words KV.
    this.activeKey = this.keyOf(ref);
    this.activeWord = ref.surface;
    this.activeShortDesc = `${ref.lemma} (${ref.pos}, ${ref.senseId})`; // placeholder
  }

  // ---------- Core logic ----------
  private buildSegments(text: string, activeWords: FindtheWord[]): Segment[] {
    if (!text) return [];
    if (!activeWords?.length) return [{ type: 'text', text }];

    const surfaceMap = new Map<string, FindtheWord>();
    for (const w of activeWords) {
      const k = (w.surface ?? '').toLowerCase();
      if (k && !surfaceMap.has(k)) surfaceMap.set(k, w);
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

      const ref = surfaceMap.get(label.toLowerCase());
      out.push(ref ? { type: 'kw', label, ref } : { type: 'text', text: label });

      last = start + label.length;
    }

    if (last < text.length) out.push({ type: 'text', text: text.slice(last) });
    return out;
  }

  trackSeg = (_: number, s: Segment) =>
    s.type === 'text'
      ? `t:${s.text}`
      : `k:${s.ref.lemma}:${s.ref.pos}:${s.ref.senseId}:${s.label}`;
}
