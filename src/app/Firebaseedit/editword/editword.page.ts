import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { wordDocId } from '../../utils/ids';

import {
  WordDoc,
  PartOfSpeech,
  DefinitionSense,
  TopicUsage
} from '../../data/lexamatewords.model';

@Component({
  selector: 'app-editword',
  templateUrl: './editword.page.html',
  styleUrls: ['./editword.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EditwordPage implements OnInit {
  lemmaParam = '';
  loading = false;
  saving = false;
  error: string | null = null;
  saveMessage: string | null = null;

  word: WordDoc | null = null;

  constructor(
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.lemmaParam = this.route.snapshot.paramMap.get('lemma') || '';
    if (this.lemmaParam) {
      this.loadWord(this.lemmaParam);
    } else {
      this.error = 'No lemma provided in route.';
    }
  }

  private async loadWord(lemma: string) {
    this.loading = true;
    this.error = null;
    this.saveMessage = null;

    try {
      const ref = doc(db, 'EnglishB1words', wordDocId(lemma));
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        this.error = `Word "${lemma}" not found in Firestore.`;
        return;
      }

      const data = snap.data() as WordDoc;
      this.word = this.normaliseWord(data);
    } catch (err) {
      console.error(err);
      this.error = 'Failed to load word from Firestore.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Ensure nested structures exist so template bindings don't explode:
   * - partsOfSpeech[0]
   * - definitions[].definition is LocalisedDefinition
   * - definitions[].examples['en-GB'][0], ['en-US'][0]
   * - topics[].examples[locale][0]
   * - variants[locale].phonetics present when editing IPA
   */
  private normaliseWord(word: WordDoc): WordDoc {
    // --- PARTS OF SPEECH / DEFINITIONS / EXAMPLES ---

    if (!word.partsOfSpeech || !word.partsOfSpeech.length) {
      word.partsOfSpeech = [
        {
          partOfSpeech: 'verb',
          definitions: [],
        },
      ];
    }

    for (const pos of word.partsOfSpeech) {
      if (!pos.definitions) pos.definitions = [];

      for (const def of pos.definitions) {
        // Normalise definition to LocalisedDefinition
        const anyDef: any = def.definition;

        // Case 1: old schema: definition is a string
        if (typeof anyDef === 'string') {
          const text = anyDef;
          def.definition = {
            'en-GB': { text, audioUrl: '' },
            'en-US': { text, audioUrl: '' },
          } as any;
        }
        // Case 2: missing or wrong type -> create empty LocalisedDefinition
        else if (!anyDef || typeof anyDef !== 'object') {
          def.definition = {
            'en-GB': { text: '', audioUrl: '' },
            'en-US': { text: '', audioUrl: '' },
          } as any;
        } else {
          // Case 3: object but maybe missing some locales/fields
          if (!anyDef['en-GB']) {
            anyDef['en-GB'] = { text: '', audioUrl: '' };
          } else {
            if (typeof anyDef['en-GB'].text !== 'string') {
              anyDef['en-GB'].text = '';
            }
            if (anyDef['en-GB'].audioUrl === undefined) {
              anyDef['en-GB'].audioUrl = '';
            }
          }

          if (!anyDef['en-US']) {
            anyDef['en-US'] = { text: '', audioUrl: '' };
          } else {
            if (typeof anyDef['en-US'].text !== 'string') {
              anyDef['en-US'].text = '';
            }
            if (anyDef['en-US'].audioUrl === undefined) {
              anyDef['en-US'].audioUrl = '';
            }
          }

          def.definition = anyDef;
        }

        // Normalise examples
        if (!def.examples) {
          def.examples = {
            'en-GB': [],
            'en-US': [],
          };
        }
        if (!def.examples['en-GB']) def.examples['en-GB'] = [];
        if (!def.examples['en-US']) def.examples['en-US'] = [];

        if (!def.examples['en-GB'].length) {
          def.examples['en-GB'].push({ text: '', audioUrl: '' });
        }
        if (!def.examples['en-US'].length) {
          def.examples['en-US'].push({ text: '', audioUrl: '' });
        }
      }
    }

    // --- TOPICS / TOPIC EXAMPLES ---

    if (!word.topics) word.topics = [];
    for (const t of word.topics) {
      if (!t.examples) {
        t.examples = {
          'en-GB': [],
          'en-US': [],
        };
      }
      if (!t.examples['en-GB']) t.examples['en-GB'] = [];
      if (!t.examples['en-US']) t.examples['en-US'] = [];

      if (!t.examples['en-GB'].length) {
        t.examples['en-GB'].push({ text: '', audioUrl: '' });
      }
      if (!t.examples['en-US'].length) {
        t.examples['en-US'].push({ text: '', audioUrl: '' });
      }
    }

    return word;
  }

  // convenience getter for the first partOfSpeech
  get mainPOS(): PartOfSpeech | null {
    if (!this.word || !this.word.partsOfSpeech || !this.word.partsOfSpeech.length) {
      return null;
    }
    return this.word.partsOfSpeech[0];
  }

  trackByIndex(index: number, _item: any) {
    return index;
  }

  addSense() {
    if (!this.word || !this.word.partsOfSpeech || !this.word.partsOfSpeech.length) {
      return;
    }

    const pos = this.word.partsOfSpeech[0];

    if (!pos.definitions) {
      pos.definitions = [];
    }

    const nextIndex = pos.definitions.length + 1;

    const newSense: DefinitionSense = {
      senseId: `s${nextIndex}`,
      definition: {
        'en-GB': { text: '', audioUrl: '' },
        'en-US': { text: '', audioUrl: '' },
      } as any,
      examples: {
        'en-GB': [{ text: '', audioUrl: '' }],
        'en-US': [{ text: '', audioUrl: '' }],
      },
      // keep url optional if you have it in the model
      //url: '',
    };

    pos.definitions.push(newSense);
  }

  async onSave() {
    if (!this.word) return;

    this.saving = true;
    this.error = null;
    this.saveMessage = null;

    try {
      const ref = doc(db, 'EnglishB1words', wordDocId(this.word.lemma));

      const payload: WordDoc = {
        ...this.word,
        language: 'en',
      };

      await setDoc(
        ref,
        {
          ...payload,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      this.saveMessage = 'Word saved successfully.';
    } catch (err) {
      console.error(err);
      this.error = 'Failed to save word.';
    } finally {
      this.saving = false;
    }
  }

  // ---------- IPA helpers ----------

  getGbIpa(): string {
    const ipa = this.word?.variants?.['en-GB']?.phonetics?.ipa;
    return ipa ?? '';
  }

  setGbIpa(value: string) {
    if (!this.word) return;

    if (!this.word.variants) {
      this.word.variants = {};
    }
    if (!this.word.variants['en-GB']) {
      this.word.variants['en-GB'] = {};
    }
    if (!this.word.variants['en-GB']!.phonetics) {
      this.word.variants['en-GB']!.phonetics = {
        ipa: value,
        audioUrl: '',
        voice: 'en-GB',
      };
    }

    this.word.variants['en-GB']!.phonetics!.ipa = value;
  }

  getUsIpa(): string {
    const ipa = this.word?.variants?.['en-US']?.phonetics?.ipa;
    return ipa ?? '';
  }

  setUsIpa(value: string) {
    if (!this.word) return;

    if (!this.word.variants) {
      this.word.variants = {};
    }
    if (!this.word.variants['en-US']) {
      this.word.variants['en-US'] = {};
    }
    if (!this.word.variants['en-US']!.phonetics) {
      this.word.variants['en-US']!.phonetics = {
        ipa: value,
        audioUrl: '',
        voice: 'en-US',
      };
    }

    this.word.variants['en-US']!.phonetics!.ipa = value;
  }
}
