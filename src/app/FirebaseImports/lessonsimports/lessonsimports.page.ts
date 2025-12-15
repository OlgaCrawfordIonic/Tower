import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonButton } from '@ionic/angular/standalone';
import { B1LessonsImport } from '../b1-lessons-import';

@Component({
  selector: 'app-lessonsimports',
  templateUrl: './lessonsimports.page.html',
  styleUrls: ['./lessonsimports.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton]
})
export class LessonsimportsPage  {

  importing = false;
  importedCount = 0;
 
  constructor(private importService: B1LessonsImport) {}

  async runImport() {
    this.importing = true;
    try {
      this.importedCount = await this.importService.importFromAssets();
      console.log(`Imported ${this.importedCount} B1 lessons.`);
    } catch (err) {
      console.error('Import failed', err);
    } finally {
      this.importing = false;
    }
  }
}
