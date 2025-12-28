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

  words: WordDoc[] = [];

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
        this.words = await this.fetchByLemmas(lemmas);
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

  private async fetchByLemmas(lemmas: string[]): Promise<WordDoc[]> {
    const results: WordDoc[] = [];

    // Firestore "in" operator allows up to 10 values at a time
    const CHUNK_SIZE = 10;
    for (let i = 0; i < lemmas.length; i += CHUNK_SIZE) {
      const chunk = lemmas.slice(i, i + CHUNK_SIZE);

      const colRef = collection(db, 'EnglishB1words');
      const qRef = query(
        colRef,
        where('lemma', 'in', chunk)
      );

      const snap = await getDocs(qRef);
      snap.forEach(docSnap => {
        results.push(docSnap.data() as WordDoc);
      });
    }

    // sort by id if present, otherwise by lemma
    results.sort((a, b) => {
      const aId = (a as any).id ?? 0;
      const bId = (b as any).id ?? 0;
      if (aId && bId) return aId - bId;
      return a.lemma.localeCompare(b.lemma);
    });

    return results;
  }

  private async fetchByIdRange(from: number, to: number): Promise<WordDoc[]> {
    const colRef = collection(db, 'EnglishB1words');

    const qRef = query(
      colRef,
      where('id', '>=', from),
      where('id', '<=', to),
      orderBy('id', 'asc')
    );

    const snap = await getDocs(qRef);

    const results: WordDoc[] = [];
    snap.forEach(docSnap => {
      results.push(docSnap.data() as WordDoc);
    });

    return results;
  }

  onEdit(word: WordDoc) {
     // Navigate to /edit-word/:lemma
    this.router.navigate(['/editword', word.lemma]);
    // For now just log – later you can navigate to an edit page or open a modal
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
