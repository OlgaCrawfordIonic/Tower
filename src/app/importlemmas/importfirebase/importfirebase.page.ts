import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { WordDoc } from '../../data/lexamatewords.model';

// 🔥 Firestore client
import {
  writeBatch,
  doc,
  serverTimestamp,
  DocumentReference,
} from 'firebase/firestore';
import { db } from '../../firebase';          // adjust path if needed
import { wordDocId } from '../../utils/ids';  // adjust path if needed

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
  selector: 'app-importfirebase',
  templateUrl: './importfirebase.page.html',
  styleUrls: ['./importfirebase.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule, RouterLink]
})
export class ImportfirebasePage {
  // Text area content (JSON from ChatGPT)
  jsonText = '';
   jsonPlaceholder =
    `{"words":[{"lemma":"compose","partOfSpeech":"verb","definitions":[{"text":"to make or create"}]}]}`;

    // validation state
  checking = false;
  error: string | null = null;
  issues: ValidationIssue[] = [];
  validCount = 0;
  totalCount = 0;
  hasChecked = false;

  // import state
  importing = false;
  importError: string | null = null;
  importSuccess: string | null = null;

  // last successfully parsed docs (from the last check)
  private lastDocs: WordDoc[] | null = null;

  

  private readonly referenceJsonPath = 'assets/b1-words-openai-input-with-ids.json';
  private referenceMap: Map<string, ReferenceWord> | null = null;

  constructor(private http: HttpClient) { }

  async onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const text = await file.text();
  this.jsonText = text; // fills the textarea automatically
}


  // --------- PUBLIC HANDLER: called from the "Check" button ----------

 

  

  //Firebase impots


  
   // --------- PUBLIC HANDLER: called from the "Check" button ----------

  // ------------- CHECK BUTTON -------------

  async onCheckClick() {
    this.error = null;
    this.issues = [];
    this.validCount = 0;
    this.totalCount = 0;
    this.hasChecked = false;
    this.lastDocs = null;
    this.importError = null;
    this.importSuccess = null;

    const raw = this.jsonText?.trim();
    if (!raw) {
      this.error = 'Please paste JSON text first.';
      return;
    }

    this.checking = true;

    try {
      // 1) Parse
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
      this.lastDocs = docs;  // save for import later

      // 2) Load reference
      const refMap = await this.loadReferenceMap();

      // 3) Validate each lemma
      for (const doc of docs) {
        this.validateWordDoc(doc, refMap);
      }

      // 4) Count valid lemmas
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

  // ------------- IMPORT BUTTON -------------

  async onImportClick() {
  this.importError = null;
  this.importSuccess = null;

  if (!this.hasChecked) {
    this.importError = 'Please run "Check for errors" first.';
    return;
  }

  if (this.issues.length > 0) {
    this.importError = 'There are still validation issues. Fix them before importing.';
    return;
  }

  if (!this.lastDocs || !this.lastDocs.length) {
    this.importError = 'No parsed documents available. Please check your JSON again.';
    return;
  }

  this.importing = true;

  try {
    const docsToImport = this.lastDocs;
    const batch = writeBatch(db);

    for (const word of docsToImport) {
      const lemma = word.lemma;
      if (!lemma) continue;

      const ref = doc(
        db,
        'EnglishB1words',      // collection
        wordDocId(lemma)       // doc id based on lemma
      );

      batch.set(
        ref,
        {
          ...word,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }        // safe if you ever re-import
      );
    }

    await batch.commit();

    this.importSuccess = `Imported ${docsToImport.length} word(s) into Firestore (EnglishB1words).`;
  } catch (err) {
    console.error('Import failed', err);
    this.importError = 'Import failed. See console for details.';
  } finally {
    this.importing = false;
  }
}


  // ------------- REFERENCE LOADING -------------

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

    // ID check (if present)
    const anyDoc = doc as any;
    if (typeof anyDoc.id === 'number' && anyDoc.id !== ref.id) {
      this.issues.push({
        lemma,
        type: 'id-mismatch',
        message: `ID mismatch for "${lemma}": got ${anyDoc.id}, expected ${ref.id}.`,
        details: { got: anyDoc.id, expected: ref.id },
      });
    }

    // Lessons check  (compare as sets)
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

    // Topics check compare set of topicKeys)
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



  



