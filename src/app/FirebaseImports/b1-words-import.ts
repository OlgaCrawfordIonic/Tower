import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  writeBatch,
  doc,
  serverTimestamp,
  DocumentReference,
} from 'firebase/firestore';
import { db } from '../firebase';           // same as in your LevelImportService
import { wordDocId } from '../utils/ids';   // your existing helper
import { RawLessonFromJson } from './b1-lessons.models';
import {
  WordDoc,
  TopicUsage,
  Localised,
  TextWithAudio
} from '../data/lexamatewords.model';
interface WordForOpenAI {
  lemma: string;
  lessons: number[];
  topics: string[];
}


interface WordAgg {
 
  lemma: string;
  lessons: Set<number>;
  topics: Map<string, Set<number>>;   // topicKey -> lesson numbers
}

// empty examples object
const makeEmptyExamples = (): Localised<TextWithAudio[]> => ({
  'en-GB': [],
  'en-US': [],
});


@Injectable({ providedIn: 'root' })
export class B1WordsImport {
  private readonly jsonPath = 'assets/B1-lessons-by-topic.json';

  constructor(private http: HttpClient) {}

  private refForLemma(lemma: string): DocumentReference {
    return doc(db, 'EnglishB1words', wordDocId(lemma));
  }

  /** Build a full WordDoc with default/empty fields for now */
  private buildWordDoc(agg: WordAgg): WordDoc {
    const lessons = Array.from(agg.lessons).sort((a, b) => a - b);

    const topics: TopicUsage[] = [];
    agg.topics.forEach((lessonSet, topicKey) => {
      topics.push({
        topicKey,
        lessons: Array.from(lessonSet).sort((a, b) => a - b),
        examples: makeEmptyExamples(),
      });
    });

    return {
      id:0,
      lemma: agg.lemma,
      english: '',
      enUrl: '',
      american: '',
      amUrl: '',
      language: 'en',
      lessons,
    
      levels: ['B1'],
      partsOfSpeech: [],
      topics:[],
      variants: {},   // no phonetics yet
      // createdAt / updatedAt added in batch.set
    };
  }

   /** COMMON: build aggregates (lemma → lessons + topics) from lessons JSON */
  private buildAggregates(json: RawLessonFromJson[]): Map<string, WordAgg> {
    const map = new Map<string, WordAgg>();

    for (const lesson of json) {
      const lessonNo = lesson.lesson;
      const topicKey = lesson.topic;
      const allWords = [...lesson.lemmas.part1, ...lesson.lemmas.part2];

      for (const rawWord of allWords) {
        const lemma = rawWord.trim();
        if (!lemma) continue;

        let agg = map.get(lemma);
        if (!agg) {
          agg = {
            lemma,
            lessons: new Set<number>(),
            topics: new Map<string, Set<number>>(),
          };
          map.set(lemma, agg);
        }

        // add lesson to lemma's lesson set
        agg.lessons.add(lessonNo);

        // add lesson to topic-specific set
        let topicSet = agg.topics.get(topicKey);
        if (!topicSet) {
          topicSet = new Set<number>();
          agg.topics.set(topicKey, topicSet);
        }
        topicSet.add(lessonNo);
      }
    }

    return map;
  }

/**
   * Import from assets/B1-lessons-by-topic.json into collection EnglishB1words.
   * Returns the number of distinct lemmas created/updated.
   */
  async importFromLessonsFile(): Promise<number> {
    const json = await this.http
      .get<RawLessonFromJson[]>(this.jsonPath)
      .toPromise();

    if (!json || !Array.isArray(json) || !json.length) {
      console.warn('No lessons found in JSON');
      return 0;
    }

    const map = this.buildAggregates(json);

    // Convert aggregates to WordDoc[]
    const wordDocs: WordDoc[] = [];
    map.forEach((agg) => {
      wordDocs.push(this.buildWordDoc(agg));
    });

    // Write to Firestore in batches
    await this.writeInBatches(wordDocs);
    return wordDocs.length;
  }

  private async writeInBatches(words: WordDoc[]) {
    const CHUNK = 450; // like your LevelImportService

    for (let i = 0; i < words.length; i += CHUNK) {
      const slice = words.slice(i, i + CHUNK);
      const batch = writeBatch(db);

      for (const word of slice) {
        const ref = this.refForLemma(word.lemma);

        batch.set(
          ref,
          {
            ...word,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }   // safe to re-run; will update lessons/topics/levels
        );
      }

      await batch.commit();
      console.log(`Committed batch of ${slice.length} word(s).`);
    }
  }

  // 👇 NEW: build the JSON payload for OpenAI
  async buildWordsJsonForOpenAI(): Promise<{ words: WordForOpenAI[] }> {
    const json = await this.http
      .get<RawLessonFromJson[]>(this.jsonPath)
      .toPromise();

    if (!json || !Array.isArray(json) || !json.length) {
      throw new Error('No lessons found in JSON');
    }

    const map = this.buildAggregates(json);

    const words: WordForOpenAI[] = [];
    map.forEach((agg) => {
      words.push({
        lemma: agg.lemma,
        lessons: Array.from(agg.lessons).sort((a, b) => a - b),
        topics: Array.from(agg.topics.keys()).sort(),
      });
    });

    return { words };
  }

  /**
   * Import from assets/b1-lessons-by-topic.json into collection EnglishB1words.
   * Returns the number of distinct lemmas created/updated.
   */
  async importFromLessonsFileOld(): Promise<number> {
    const json = await this.http
      .get<RawLessonFromJson[]>(this.jsonPath)
      .toPromise();

    if (!json || !Array.isArray(json) || !json.length) {
      console.warn('No lessons found in JSON');
      return 0;
    }

    // 1) Aggregate by lemma: which lessons & topics it appears in
    const map = new Map<string, WordAgg>();

    for (const lesson of json) {
      const lessonNo = lesson.lesson;
      const topicKey = lesson.topic;
      const allWords = [...lesson.lemmas.part1, ...lesson.lemmas.part2];

      for (const rawWord of allWords) {
        const lemma = rawWord.trim();
        if (!lemma) continue;

        let agg = map.get(lemma);
        if (!agg) {
          agg = {
            lemma,
            lessons: new Set<number>(),
            topics: new Map<string, Set<number>>(),
          };
          map.set(lemma, agg);
        }

        // add lesson to lemma's lesson set
        agg.lessons.add(lessonNo);

        // add lesson to topic-specific set
        let topicSet = agg.topics.get(topicKey);
        if (!topicSet) {
          topicSet = new Set<number>();
          agg.topics.set(topicKey, topicSet);
        }
        topicSet.add(lessonNo);
      }
    }

    // 2) Convert aggregates to WordDoc[]
    const wordDocs: WordDoc[] = [];
    map.forEach((agg) => {
      wordDocs.push(this.buildWordDoc(agg));
    });

    // 3) Write to Firestore in batches
    await this.writeInBatches(wordDocs);
    return wordDocs.length;
  }

  private async writeInBatchesOld(words: WordDoc[]) {
    const CHUNK = 450; // like your LevelImportService

    for (let i = 0; i < words.length; i += CHUNK) {
      const slice = words.slice(i, i + CHUNK);
      const batch = writeBatch(db);

      for (const word of slice) {
        const ref = this.refForLemma(word.lemma);

        batch.set(
          ref,
          {
            ...word,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }   // safe to re-run; will update lessons/topics/levels
        );
      }

      await batch.commit();
      console.log(`Committed batch of ${slice.length} word(s).`);
    }
  }
}
