// src/app/kvoutput/wordslessons-kv-output/wordslesson-kv-loader.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WordslessonKvLoaderService {
  private base = environment.kvApiBase;          // e.g. https://<your-worker-domain>
  private defaultLevel = environment.defaultLevel; // e.g. "B1"

  makeLessonKey(level: string, lessonNo: number) {
    // matches KV key: lessons/en/B1/1.json
    return `lessons/en/${level}/${lessonNo}.json`;
  }

  async loadLesson(lessonNo: number, level = this.defaultLevel): Promise<any> {
    const key = this.makeLessonKey(level, lessonNo);

    // Your worker should support direct path fetch (recommended):
    // GET https://.../lessons/en/B1/1.json
    const url = `${this.base}/${key}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`KV lesson fetch failed: ${res.status}`);

    // If worker accidentally returns "OK" (text), this will throw.
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(
        `Lesson KV did not return JSON. URL=${url} Response starts: ${text.slice(0, 80)}`
      );
    }
  }
}
