import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton  } from '@ionic/angular/standalone';
import { B1WordsImport} from '../b1-words-import';


@Component({
  selector: 'app-wordsimport',
  templateUrl: './wordsimport.page.html',
  styleUrls: ['./wordsimport.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton]
})
export class WordsimportPage  {
  exporting = false;
importing = false;
  importedCount = 0;

  constructor(private importService: B1WordsImport) {}

  async runImport() {
    this.importing = true;
    try {
      this.importedCount = await this.importService.importFromLessonsFile();
      console.log(`Imported/updated ${this.importedCount} B1 words.`);
    } catch (err) {
      console.error('Words import failed', err);
    } finally {
      this.importing = false;
    }
  }

   async downloadOpenAIInput() {
    this.exporting = true;
    try {
      const payload = await this.importService.buildWordsJsonForOpenAI();
      const dataStr = JSON.stringify(payload, null, 2);

      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'b1-words-openai-input.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to build OpenAI input JSON', err);
    } finally {
      this.exporting = false;
    }
  }
}