// src/app/services/lesson-loader.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LessonLoaderService {
  private base = environment.kvApiBase;
  private defaultLevel = environment.defaultLevel;

  async loadLesson(lessonNo: number, level = this.defaultLevel): Promise<any> {
    const url = `${this.base}/api/lesson?level=${encodeURIComponent(level)}&id=${encodeURIComponent(
      String(lessonNo)
    )}`;

    const res = await fetch(url);

    // Helpful error message if the worker returns "OK" or HTML
    const text = await res.text();
    if (!res.ok) throw new Error(`KV lesson fetch failed: ${res.status} ${text}`);
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Lesson endpoint did not return JSON. Got: ${text.slice(0, 80)}`);
    }
  }

  // optional: raw-key loading
  async loadLessonByKey(key: string): Promise<any> {
    const url = `${this.base}/api/kv?key=${encodeURIComponent(key)}`;
    const res = await fetch(url);
    const text = await res.text();
    if (!res.ok) throw new Error(`KV key fetch failed: ${res.status} ${text}`);
    return JSON.parse(text);
  }

  makeKey(level: string, lessonNo: number) {
    return `lessons/en/${level}/${lessonNo}.json`;
  }
}
