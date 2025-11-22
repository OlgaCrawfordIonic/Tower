import { Injectable } from '@angular/core';
import { HttpClient , HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';import { TopicGroup, Lesson, LessonWithoutNumber } from './lessons.models'; // adjust path or inline interfaces

@Injectable({
  providedIn: 'root'
})
export class Lessons{
  private readonly jsonPath = 'assets/B1words-by-topics.json';

  constructor(private http: HttpClient) {}

  /** Public API – returns final lessons array */
getLessons(): Observable<Lesson[]> {
  return this.http.get<unknown>(this.jsonPath).pipe(
    tap((data) => {
      console.log('Raw JSON from file (full):');
      console.log(JSON.stringify(data, null, 2));  // 👈 pretty-print

      if (Array.isArray(data) && data.length > 0) {
        console.log('First topic object:', data[0]);
      }
    }),
    map((data) => {
      if (!Array.isArray(data)) {
        throw new Error(`Invalid JSON format: expected array, got ${typeof data}`);
      }

      const first = data[0] as any;
      if (first && (typeof first.topic !== 'string' || !Array.isArray(first.words))) {
        throw new Error(
          'Invalid TopicGroup structure: expected { topic: string, words: string[] }'
        );
      }

      const topics = data as TopicGroup[];
      console.log('Parsed TopicGroup[0]:', topics[0]); // 👈 should show Abilities + words

      const lessons = this.generateLessonsFromTopics(topics);
      console.log('Generated lessons sample:', lessons.slice(0, 3)); // 👈 preview

      return lessons;
    }),
    catchError((err) => {
      console.error('Error in getLessons():', err);
      return throwError(() => err);
    })
  );
}


  getLessons1(): Observable<Lesson[]> {
    return this.http.get<TopicGroup[]>(this.jsonPath).pipe(
      map((topics) => this.generateLessonsFromTopics(topics))
    );
  }

  // --------- MAIN PIPELINE ---------

  /** Build, shuffle and number lessons */
  private generateLessonsFromTopics(topics: TopicGroup[]): Lesson[] {
    // 1) create lessons inside each topic
    const allWithoutNumbers: LessonWithoutNumber[] = [];
    for (const topic of topics) {
      const lessonsForThisTopic = this.lessonsForTopic(topic);
      allWithoutNumbers.push(...lessonsForThisTopic);
    }

    // 2) shuffle and enforce "no same topic next to each other" as much as possible
    const arranged = this.shuffleLessonsWithTopicConstraint(allWithoutNumbers);

    // 3) add lesson numbers
    const result: Lesson[] = arranged.map((l, idx) => ({
      lesson: idx + 1,
      topic: l.topic,
      lemmas: {
        part1: [...l.lemmas.part1],
        part2: [...l.lemmas.part2],
      },
    }));

    return result;
  }

  /** For a single topic: shuffle words, split into lessons, split into part1/part2 */
  private lessonsForTopic(topicGroup: TopicGroup): LessonWithoutNumber[] {
    const words = [...topicGroup.words];

    // Step 1: shuffle words inside this topic
    this.shuffleInPlace(words);

    // Step 2: compute lesson sizes (mostly 10; all 9–17)
    const sizes = this.computeLessonSizes(words.length);

    const lessons: LessonWithoutNumber[] = [];
    let index = 0;

    for (const size of sizes) {
      const lessonWords = words.slice(index, index + size);
      index += size;

      // Step 4: split lesson into part1 and part2 (can be uneven: 4+5, 7+8, etc.)
      const splitIndex = Math.floor(lessonWords.length / 2);
      const part1 = lessonWords.slice(0, splitIndex);
      const part2 = lessonWords.slice(splitIndex);

      lessons.push({
        topic: topicGroup.topic,
        lemmas: {
          part1,
          part2,
        },
      });
    }

    return lessons;
  }

  // --------- SHUFFLING & CONSTRAINTS ---------

  /** Fisher–Yates shuffle in place */
  private shuffleInPlace<T>(arr: T[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  /**
   * Shuffle lessons so that lessons from the same topic are not adjacent,
   * as far as possible.
   */
  private shuffleLessonsWithTopicConstraint(
    input: LessonWithoutNumber[]
  ): LessonWithoutNumber[] {
    const lessons = [...input];
    this.shuffleInPlace(lessons); // initial shuffle

    for (let i = 1; i < lessons.length; i++) {
      if (lessons[i].topic === lessons[i - 1].topic) {
        let swapIndex = -1;

        for (let j = i + 1; j < lessons.length; j++) {
          if (lessons[j].topic !== lessons[i - 1].topic) {
            swapIndex = j;
            break;
          }
        }

        if (swapIndex !== -1) {
          [lessons[i], lessons[swapIndex]] = [lessons[swapIndex], lessons[i]];
        }
      }
    }

    // If all/many lessons are from same topic, some neighbours will still match – that's unavoidable.
    return lessons;
  }

  // --------- LESSON SIZE LOGIC (MOSTLY 10) ---------

  /**
   * Compute lesson sizes for a given total number of words.
   * Each lesson is between 9 and 17 words.
   * Strong preference for 10; only a few lessons shift to 9, 11, 12, etc. as needed.
   */
  private computeLessonSizes(
    total: number,
    min = 9,
    max = 17,
    preferred = 10
  ): number[] {
    if (total <= 0) {
      return [];
    }

    // 1) Start with a lesson count close to total / 10
    let count = Math.round(total / preferred);
    if (count < 1) {
      count = 1;
    }

    // Make sure it's possible: total must be between count*min and count*max
    while (total < min * count && count > 1) {
      count--;
    }
    while (total > max * count) {
      count++;
    }

    // 2) Start with all lessons at size 10 (preferred)
    const sizes = new Array(count).fill(preferred);
    let sum = preferred * count;

    // 3) If we've allocated too many words, reduce some 10s to 9 (never below min)
    if (sum > total) {
      let diff = sum - total; // how many words we must remove

      for (let i = 0; diff > 0; i++) {
        const idx = i % count;
        if (sizes[idx] > min) {
          sizes[idx]--;
          diff--;
        }
      }
    }
    // 4) If we've allocated too few words, increase some 10s to 11/12/etc. (never above max)
    else if (sum < total) {
      let diff = total - sum; // how many words we must add

      for (let i = 0; diff > 0; i++) {
        const idx = i % count;
        if (sizes[idx] < max) {
          sizes[idx]++;
          diff--;
        }
      }
    }

    return sizes;
  }
}
