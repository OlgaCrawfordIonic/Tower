import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { getFirestore, writeBatch, doc, serverTimestamp } from 'firebase/firestore';

// ---------- Types (NEW Lesson model) ----------
export type Variety = 'american' | 'british';
export type PartKey = 'part1' | 'part2';
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

// ---------- Issues ----------
type IssueSeverity = 'error' | 'warn';

export interface Issue {
  severity: IssueSeverity;
  type: string;
  message: string;
  lesson?: number;
  details?: any;
}

@Component({
  selector: 'app-importlessonsfirebase',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './importlessonsfirebase.page.html',
  styleUrls: ['./importlessonsfirebase.page.scss'],
})
export class ImportLessonsFirebasePage {
  jsonText = '';

  checking = false;
  importing = false;

  hasChecked = false;
  issues: Issue[] = [];
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
    reader.onload = () => (this.jsonText = String(reader.result || ''));
    reader.readAsText(file);
  }

  async onCheckClick() {
    this.resetMsgs();
    this.checking = true;

    try {
      const lessons = this.parseLessonsOrThrow(this.jsonText);
      const { issues, valid, total } = this.validateLessons(lessons);

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

  async onImportClick() {
    this.resetMsgs();
    this.importing = true;

    try {
      const lessons = this.parseLessonsOrThrow(this.jsonText);
      const { issues, valid, total } = this.validateLessons(lessons);

      this.issues = issues;
      this.validCount = valid;
      this.totalCount = total;
      this.hasChecked = true;

      // Only block import on ERRORs (WARNs allowed)
      const hasErrors = issues.some((i) => i.severity === 'error');
      if (hasErrors) throw new Error('Fix validation errors before importing.');

      // Fill missing lesson audio URLs
      lessons.forEach((l) => this.fillLessonAudioUrls(l));

      // Firestore batch limit is 500 writes; chunk safely.
      const CHUNK = 400;
      for (let i = 0; i < lessons.length; i += CHUNK) {
        const slice = lessons.slice(i, i + CHUNK);
        const batch = writeBatch(this.db);

        for (const lesson of slice) {
          const docId = String(lesson.lesson);
          batch.set(
            doc(this.db, 'EnglishB1Lessons', docId),
            {
              ...lesson,
              updatedAt: serverTimestamp(),
            },
            { merge: false } // overwrite whole doc
          );
        }

        await batch.commit();
      }

      this.importSuccess = `Imported ${lessons.length} lesson(s) to EnglishB1Lessons.`;
    } catch (e: any) {
      this.importError = e?.message ?? String(e);
    } finally {
      this.importing = false;
    }
  }

  // ---------- Parse ----------
  private parseLessonsOrThrow(raw: string): Lesson[] {
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error('Invalid JSON.');
    }

    const arr: any[] | null =
      Array.isArray(parsed) ? parsed : Array.isArray(parsed?.lessons) ? parsed.lessons : null;

    if (!arr) throw new Error('Expected a JSON array (or an object with a "lessons" array).');
    if (!arr.length) throw new Error('No lessons found.');
    return arr as Lesson[];
  }

  // ---------- Validate ----------
  private validateLessons(lessons: Lesson[]) {
    const issues: Issue[] = [];
    const invalidLessonNos = new Set<number>();
    const invalidIndexes = new Set<number>();

    const add = (issue: Omit<Issue, 'severity'> & Partial<Pick<Issue, 'severity'>>, idx?: number) => {
      const full: Issue = { severity: issue.severity ?? 'error', ...issue } as Issue;
      issues.push(full);
      if (typeof full.lesson === 'number') invalidLessonNos.add(full.lesson);
      if (typeof idx === 'number') invalidIndexes.add(idx);
    };

    lessons.forEach((l, idx) => {
      const lessonNo = (l as any)?.lesson;

      if (typeof lessonNo !== 'number') {
        add(
          { type: 'lesson', message: 'Missing numeric "lesson" field', details: { index: idx } },
          idx
        );
        return;
      }

      // lemmas
      const lemmas = (l as any)?.lemmas;
      if (!lemmas || typeof lemmas !== 'object') {
        add({ type: 'lemmas', lesson: lessonNo, message: 'Missing "lemmas" object' }, idx);
        return;
      }
      for (const part of ['part1', 'part2'] as const) {
        if (!Array.isArray(lemmas[part])) {
          add({ type: 'lemmas', lesson: lessonNo, message: `lemmas.${part} must be an array` }, idx);
        }
      }

      // text
      const text = (l as any)?.text;
      if (!text || typeof text !== 'object') {
        add({ type: 'text', lesson: lessonNo, message: 'Missing "text" object' }, idx);
        return;
      }

      for (const part of ['part1', 'part2'] as PartKey[]) {
        const partObj = text[part];
        if (!partObj) {
          add({ type: 'text', lesson: lessonNo, message: `Missing text.${part}` }, idx);
          continue;
        }

        for (const variety of ['british', 'american'] as Variety[]) {
          const tp = partObj[variety] as any;
          if (!tp || typeof tp !== 'object') {
            add({ type: 'text', lesson: lessonNo, message: `Missing text.${part}.${variety}` }, idx);
            continue;
          }

          const twa = tp.textWithAudio;
          if (!twa || typeof twa !== 'object') {
            add(
              { type: 'textWithAudio', lesson: lessonNo, message: `Missing textWithAudio at ${part}.${variety}` },
              idx
            );
            continue;
          }

          if (typeof twa.text !== 'string' || !twa.text.trim()) {
            add({ type: 'text', lesson: lessonNo, message: `Empty text at ${part}.${variety}` }, idx);
          }

          const aw = tp.activeWords;
          if (!Array.isArray(aw)) {
            add(
              { type: 'activeWords', lesson: lessonNo, message: `activeWords must be an array at ${part}.${variety}` },
              idx
            );
            continue;
          }

          // activeWords validation
          aw.forEach((w: any, widx: number) => {
            if (!w || typeof w !== 'object') {
              add({
                type: 'activeWord',
                lesson: lessonNo,
                message: `activeWords[${widx}] is not an object`,
                details: { part, variety },
              });
              return;
            }

            for (const key of ['surface', 'lemma', 'pos', 'senseId'] as const) {
              if (typeof w[key] !== 'string' || !w[key].trim()) {
                add({
                  type: 'activeWord',
                  lesson: lessonNo,
                  message: `Missing ${key} for activeWords[${widx}] at ${part}.${variety}`,
                  details: w,
                });
              }
            }

            // surface must exist in paragraph text (warn, not error)
            const surface = String(w.surface || '').trim();
            if (surface) {
              const hay = String(twa.text || '').toLowerCase();
              if (!hay.includes(surface.toLowerCase())) {
                add({
                  severity: 'warn',
                  type: 'surface',
                  lesson: lessonNo,
                  message: `Surface "${surface}" not found in paragraph text (${part}.${variety})`,
                  details: { surface, part, variety },
                });
              }
            }
          });
        }
      }
    });

    const invalidCount = invalidLessonNos.size + invalidIndexes.size;
    return {
      issues,
      valid: Math.max(0, lessons.length - invalidCount),
      total: lessons.length,
    };
  }

  // ---------- Fill missing lesson audio URLs ----------
  private fillLessonAudioUrls(lesson: Lesson) {
    const lessonNo = lesson.lesson;
    const level = 'B1';
    const version = 'v1';

    const ensureAudio = (variety: Variety, part: PartKey) => {
      const loc = variety === 'british' ? 'en-GB' : 'en-US';
      const twa = lesson.text[part][variety]?.textWithAudio;
      if (!twa) return;

      if (!twa.audioUrl || !String(twa.audioUrl).trim()) {
        twa.audioUrl = `${loc}/${level}/${version}/lessons/${lessonNo}/${part}/text.mp3`;
      }
    };

    (['part1', 'part2'] as PartKey[]).forEach((part) => {
      (['british', 'american'] as Variety[]).forEach((variety) => ensureAudio(variety, part));
    });
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
}
