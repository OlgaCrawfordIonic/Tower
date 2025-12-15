import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { WordDoc } from '../../data/lexamatewords.model';

interface ReferenceWord {
  id: number;
  lemma: string;
  lessons: number[];
  topics: string[];
}

interface ValidationIssue {
  lemma?: string;
  type:
    | 'missing-lemma'
    | 'id-mismatch'
    | 'lessons-mismatch'
    | 'topics-mismatch'
    | 'parse-error'
    | 'shape-error';
  message: string;
  details?: any;
}

@Component({
  selector: 'app-content-jsontools',
  templateUrl: './content-jsontools.page.html',
  styleUrls: ['./content-jsontools.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule, RouterLink]
})
export class ContentJsonToolsPage  {
   // Text area content (JSON from ChatGPT)
  jsonText = '';
   jsonPlaceholder =
    `{"words":[{"lemma":"compose","partOfSpeech":"verb","definitions":[{"text":"to make or create"}]}]}`;

  // Results / state
  checking = false;
  error: string | null = null;
  issues: ValidationIssue[] = [];
  validCount = 0;
  totalCount = 0;
  hasChecked = false;

  private readonly referenceJsonPath = 'assets/b1-words-openai-input-with-ids.json';
  private referenceMap: Map<string, ReferenceWord> | null = null;

  constructor(private http: HttpClient) { }

  

  // --------- PUBLIC HANDLER: called from the "Check" button ----------

  async onCheckClick() {
    this.error = null;
    this.issues = [];
    this.validCount = 0;
    this.totalCount = 0;
    this.hasChecked = false;

    const raw = this.jsonText?.trim();
    if (!raw) {
      this.error = 'Please paste JSON text first.';
      return;
    }

    this.checking = true;

    try {
      // 1) Parse JSON
      let parsed: any;
      try {
        parsed = JSON.parse(raw);
      } catch (err: any) {
        this.issues.push({
          type: 'parse-error',
          message: 'JSON is not valid. Please check the syntax.',
          details: String(err),
        });
        this.error = 'JSON parse error.';
        return;
      }

      // Accept either { "words": [...] } or [...] directly
      let docs: WordDoc[];
      if (Array.isArray(parsed)) {
        docs = parsed as WordDoc[];
      } else if (parsed && Array.isArray(parsed.words)) {
        docs = parsed.words as WordDoc[];
      } else {
        this.issues.push({
          type: 'shape-error',
          message: 'JSON must be either an array or an object with a "words" array.',
        });
        this.error = 'Unexpected JSON shape.';
        return;
      }

      if (!docs.length) {
        this.error = 'The "words" array is empty.';
        return;
      }

      this.totalCount = docs.length;

      // 2) Load reference map (lemma -> ReferenceWord)
      const refMap = await this.loadReferenceMap();

      // 3) Validate each lemma
      for (const doc of docs) {
        this.validateWordDoc(doc, refMap);
      }

      // 4) Count "valid" docs (no issues for that lemma)
      const lemmasWithIssues = new Set(
        this.issues.filter(i => i.lemma).map(i => i.lemma as string)
      );
      const uniqueLemmas = new Set(docs.map(d => d.lemma));
      this.validCount = Array.from(uniqueLemmas).filter(
        lemma => !lemmasWithIssues.has(lemma)
      ).length;

      this.hasChecked = true;
    } finally {
      this.checking = false;
    }
  }

  // --------- REFERENCE LOADING ----------

  private async loadReferenceMap(): Promise<Map<string, ReferenceWord>> {
    if (this.referenceMap) {
      return this.referenceMap;
    }

    const ref = await firstValueFrom(
      this.http.get<{ words: ReferenceWord[] }>(this.referenceJsonPath)
    );

    if (!ref || !Array.isArray(ref.words)) {
      throw new Error('Reference JSON has no "words" array.');
    }

    const map = new Map<string, ReferenceWord>();
    for (const w of ref.words) {
      map.set(w.lemma, w);
    }

    this.referenceMap = map;
    return map;
  }

  // --------- PER-WORD VALIDATION ----------

  private validateWordDoc(doc: WordDoc, refMap: Map<string, ReferenceWord>) {
    const lemma = doc.lemma;

    if (!lemma) {
      this.issues.push({
        type: 'shape-error',
        message: 'WordDoc has no lemma.',
        details: doc,
      });
      return;
    }

    const ref = refMap.get(lemma);
    if (!ref) {
      this.issues.push({
        lemma,
        type: 'missing-lemma',
        message: `Lemma "${lemma}" does not exist in reference file.`,
      });
      return;
    }

    // 1) ID check (if id present in doc)
    const anyDoc = doc as any;
    if (typeof anyDoc.id === 'number' && anyDoc.id !== ref.id) {
      this.issues.push({
        lemma,
        type: 'id-mismatch',
        message: `ID mismatch for "${lemma}": got ${anyDoc.id}, expected ${ref.id}.`,
        details: { got: anyDoc.id, expected: ref.id },
      });
    }

    // 2) Lessons check (compare as sets)
    const docLessons = Array.isArray(doc.lessons) ? doc.lessons : [];
    const refLessons = Array.isArray(ref.lessons) ? ref.lessons : [];

    const docSet = new Set(docLessons);
    const refSet = new Set(refLessons);

    const extraInDoc = docLessons.filter(n => !refSet.has(n));
    const missingInDoc = refLessons.filter(n => !docSet.has(n));

    if (extraInDoc.length || missingInDoc.length) {
      this.issues.push({
        lemma,
        type: 'lessons-mismatch',
        message: `Lesson numbers do not match for "${lemma}".`,
        details: {
          docLessons,
          refLessons,
          extraInDoc,
          missingInDoc,
        },
      });
    }

    // 3) Topics check (compare set of topicKeys)
    const docTopicKeys = (doc.topics || []).map(t => t.topicKey).sort();
    const refTopicKeys = (ref.topics || []).slice().sort();

    const docSetTopics = new Set(docTopicKeys);
    const refSetTopics = new Set(refTopicKeys);

    const extraTopics = docTopicKeys.filter(t => !refSetTopics.has(t));
    const missingTopics = refTopicKeys.filter(t => !docSetTopics.has(t));

    if (extraTopics.length || missingTopics.length) {
      this.issues.push({
        lemma,
        type: 'topics-mismatch',
        message: `Topics do not match for "${lemma}".`,
        details: {
          docTopicKeys,
          refTopicKeys,
          extraTopics,
          missingTopics,
        },
      });
    }
  }
}

  


