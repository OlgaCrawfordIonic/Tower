// src/app/services/lemma-loader.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'

type Locale = 'en-GB' | 'en-US';

@Injectable({ providedIn: 'root' })
export class LemmaLoaderService {
  private base = environment.kvApiBase;
  private defaultLevel = environment.defaultLevel;

  private slug(s: string) {
    return String(s || '')
      .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async load(lemma: string, level = this.defaultLevel): Promise<any> {
    const slug = this.slug(lemma);
    const url = `${this.base}/api/lemma?level=${encodeURIComponent(level)}&slug=${encodeURIComponent(slug)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`KV fetch failed: ${res.status}`);
    return res.json();
  }
}
