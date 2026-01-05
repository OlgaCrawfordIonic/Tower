import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule} from '@ionic/angular';
import { WordDoc } from '../../data/lexamatewords.model';

import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../firebase'; // adjust path if needed
import { Router, RouterLink } from '@angular/router';
type WordRow = WordDoc & { _docId: string };


@Component({
  selector: 'app-reviewwords',
  templateUrl: './reviewwords.page.html',
  styleUrls: ['./reviewwords.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,RouterLink]
})
export class ReviewwordsPage  {

  
  // Inputs
  lemmaInput = '';         // user types lemmas here
  idFrom: number | null = null;
  idTo: number | null = null;

  // State
  loading = false;
  error: string | null = null;

  words: WordRow[] = [];

  constructor(private router:Router) {}

  async onViewClick() {
    this.error = null;
    this.words = [];

    const rawLemma = this.lemmaInput.trim();
    const hasLemmaFilter = rawLemma.length > 0;
    const hasIdRange = this.idFrom != null && this.idTo != null;

    if (!hasLemmaFilter && !hasIdRange) {
      this.error = 'Please type at least one lemma or an ID range.';
      return;
    }

    // If lemmas are given, we ignore ID range
    this.loading = true;

    try {
      if (hasLemmaFilter) {
        const lemmas = this.parseLemmaInput(rawLemma);
        if (!lemmas.length) {
          this.error = 'Could not find any lemma in your input.';
          return;
        }
         console.log('LEMMA INPUT RAW:', JSON.stringify(rawLemma));
  console.log('LEMMAS PARSED:', lemmas, 'count=', lemmas.length);

  const res = await this.fetchByLemmas(lemmas);

  console.log('FETCH RESULT COUNT:', res.length);
  console.log('FETCH RESULT LEMMAS:', res.map(x => x.lemma));

  this.words = res;
      } else if (hasIdRange) {
        const from = Math.min(this.idFrom!, this.idTo!);
        const to = Math.max(this.idFrom!, this.idTo!);
        this.words = await this.fetchByIdRange(from, to);
      }

      if (!this.words.length && !this.error) {
        this.error = 'No matching words found.';
      }
    } catch (err) {
      console.error('Error fetching words', err);
      this.error = 'Something went wrong while loading words. See console.';
    } finally {
      this.loading = false;
    }
  }

  // --- Helpers ---

  private parseLemmaInput(text: string): string[] {
    // split by comma, semicolon, newline or whitespace
    const parts = text
      .split(/[\s,;]+/)
      .map(s => s.trim())
      .filter(Boolean);

    return Array.from(new Set(parts)); // dedupe
  }

private async fetchByLemmas(lemmas: string[]): Promise<WordRow[]> {
  const results: WordRow[] = [];

  const CHUNK_SIZE = 10;
  for (let i = 0; i < lemmas.length; i += CHUNK_SIZE) {
    const chunk = lemmas.slice(i, i + CHUNK_SIZE);

    const qRef = query(
      collection(db, 'EnglishB1words'),
      where('lemma', 'in', chunk)
    );

    const snap = await getDocs(qRef);

    console.log(
      'SNAP SIZE:',
      snap.size,
      'DOC IDS:',
      snap.docs.map(d => JSON.stringify(d.id)),
      'LEMMAS:',
      snap.docs.map(d => JSON.stringify((d.data() as any).lemma))
    );

    snap.forEach(docSnap => {
      const data = docSnap.data() as any;
      console.log('FOUND:', { docId: docSnap.id, lemma: data.lemma });

      // ✅ push once
      results.push({ ...(docSnap.data() as WordDoc), _docId: docSnap.id });
    });
  }

  results.sort((a, b) => {
    const aId = (a as any).id ?? 0;
    const bId = (b as any).id ?? 0;
    if (aId && bId) return aId - bId;
    return a.lemma.localeCompare(b.lemma);
  });

  return results;
}


  private async fetchByIdRange(from: number, to: number): Promise<WordRow[]> {
    const colRef = collection(db, 'EnglishB1words');

    const qRef = query(
      colRef,
      where('id', '>=', from),
      where('id', '<=', to),
      orderBy('id', 'asc')
    );

    const snap = await getDocs(qRef);

    const results: WordRow[] = [];
    snap.forEach(docSnap => {
      results.push(docSnap.data() as WordRow);
    });

    return results;
  }

  onEdit(word: WordRow) {
     // Navigate to /edit-word/:lemma
 this.router.navigate(['/editword', word._docId]);    // For now just log – later you can navigate to an edit page or open a modal
    console.log('Edit clicked for:', word.lemma, word);
  }

  hasId(word: any): boolean {
  return word && word.id != null;
}

getId(word: any): number | null {
  return word && word.id != null ? word.id : null;
}
topicKeys(word: WordDoc): string {
  if (!word.topics || !word.topics.length) {
    return '';
  }
  return word.topics.map(t => t.topicKey).join(', ');
}


}
