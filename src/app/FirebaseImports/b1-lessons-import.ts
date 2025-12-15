import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  writeBatch,
  doc,
  serverTimestamp,
  DocumentReference,
} from 'firebase/firestore';
import { db } from '../firebase'; // same db you already use
import { RawLessonFromJson, Lessons } from './b1-lessons.models';

@Injectable({ providedIn: 'root' })
export class B1LessonsImport{
  // path to your generated JSON file (put it in src/assets/)
  private readonly jsonPath = 'assets/B1-lessons-by-topic.json';

  constructor(private http: HttpClient) {}

  /** Reference to lesson doc (collection: EnglishB1Lessons, id = lesson number as string) */
  private refForLesson(lessonNumber: number): DocumentReference {
    return doc(db, 'EnglishB1Lessons', lessonNumber.toString());
  }

  /** Base Firestore document built from the raw JSON lesson */
  private baseLessonDoc(raw: RawLessonFromJson): Lessons {
    return {
      lesson: raw.lesson,
       topic: raw.topic,    
      lemmas: {
        part1: raw.lemmas.part1,
        activeWordsBritish1: [],
        activeWordsAmerican1: [],
        part2: raw.lemmas.part2,
        activeWordsBritish2: [],
        activeWordsAmerican2: [],
      },
      text: {
        part1: {
          american: '',
          british: '',
        },
        part2: {
          american: '',
          british: '',
        },
      },
    };
  }

  /**
   * Import all B1 lessons from the assets JSON into Firestore.
   * Returns the number of lessons imported.
   */
  async importFromAssets(): Promise<number> {
    const json = await this.http
      .get<RawLessonFromJson[]>(this.jsonPath)
      .toPromise();

    if (!json || !Array.isArray(json) || !json.length) {
      console.warn('No lessons found in JSON');
      return 0;
    }

    const lessons = json;
    await this.writeInBatches(lessons);
    return lessons.length;
  }

  /** Write lessons in Firestore batches (safe to re-run; uses merge) */
  private async writeInBatches(lessons: RawLessonFromJson[]) {
    const CHUNK = 450; // Firestore batch soft limit, like in your old service

    for (let i = 0; i < lessons.length; i += CHUNK) {
      const slice = lessons.slice(i, i + CHUNK);
      const batch = writeBatch(db);

      for (const raw of slice) {
        const ref = this.refForLesson(raw.lesson);
        const base = this.baseLessonDoc(raw);

        batch.set(
          ref,
          {
            ...base,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true } // safe to re-run, will update lemmas/text but not wipe everything
        );
      }

      await batch.commit();
      console.log(`Committed batch of ${slice.length} lesson(s).`);
    }
  }
}
