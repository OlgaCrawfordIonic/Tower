
// Example usage (e.g., in a page)
import { Component} from '@angular/core';
import {LeximatewordsService} from '../leximatewords.service';
import { WordDoc, CEFR } from '../lexamatewords.model';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem,IonButton, IonLabel} from '@ionic/angular/standalone';
import { LevelImportService } from '../../services/level-import';

@Component({
  selector: 'app-leximatewords',
  templateUrl: './leximatewords.page.html',
  styleUrls: ['./leximatewords.page.scss'],
  standalone: true,
 imports: [IonContent, IonHeader, IonTitle, IonToolbar,IonList, IonItem,IonButton, IonLabel]
  

})
export class LeximatewordsPage {
   msg = '';
  constructor(private words: LeximatewordsService,private importer: LevelImportService) {}

/*  async save() {
    const word: WordDoc = {
      lemma: 'ingenious',
      language: 'en',
      lessons: [1],
      shortDescription: 'clever, original, highly inventive',
      levels: ['C1'],
      //topics: ['innovation', 'problem-solving'],
      shared: {
        partsOfSpeech: [
          {
            partOfSpeech: 'adjective',
            definitions: [
              { senseId: 's1', definition: 'clever, original, and inventive.', topics: ['problem-solving'] },
              { senseId: 's2', definition: 'cleverly devised and well suited to its purpose.', topics: ['innovation'] }
            ]
          }
        ]
      },
      variants: {
        'en-GB': {
          phonetics: { ipa: 'ɪnˈdʒiː.ni.əs', audioUrl: null, voice: 'en-GB' },
          examplesBySense: {
            s1: [
              'He was an ingenious engineer who devised a system for recycling waste water.',
              'The ingenious design of the machine allowed it to operate with minimal energy.'
            ],
            s2: [
              'The ingenious device saved the company thousands of pounds.',
              'She came up with an ingenious solution to the problem.'
            ]
          }
        },
        'en-US': {
          phonetics: { ipa: 'ɪnˈdʒiː.ni.əs', audioUrl: null, voice: 'en-US' },
          examplesBySense: {
            s1: [
              'He was an ingenious engineer who devised a system for recycling wastewater.',
              'The machine’s ingenious design allowed it to run on minimal energy.'
            ],
            s2: [
              'The ingenious device saved the company thousands of dollars.',
              'She came up with an ingenious solution to the problem.'
            ]
          }
        }
      }
    };

    await this.words.upsertWord(word);
    console.log('Saved!');
  }

  async runFromAssets(level: CEFR, path: string) {
    try {
      const n = await this.importer.importFromAssets(level, path);
      this.msg = `Imported ${n} ${level} words from ${path}.`;
    } catch (e: any) {
      this.msg = `Error: ${e?.message || e}`;
      console.error(e);
    }
  }

 async pick(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    // Change 'A1' here to import other levels from chosen file
    const level: CEFR = 'A1';
    try {
      const n = await this.importer.importFromFile(level, file);
      this.msg = `Imported ${n} ${level} words from file.`;
    } catch (e: any) {
      this.msg = `Error: ${e?.message || e}`;
      console.error(e);
    } finally {
      input.value = '';
    }
  }*/

}
