import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonList,IonItemDivider,IonLabel, IonItem, IonButton, IonButtons} from '@ionic/angular/standalone';
import { Lessons} from '../lessons';
import { Lesson } from '../lessons.models'; // or from './lessons.service' if you inlined
@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.page.html',
  styleUrls: ['./lessons.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonList,IonItemDivider,IonLabel, IonItem, IonButton, IonButtons]
})
export class LessonsPage  {
lessons: Lesson[] = [];

  constructor(private lessonsService: Lessons) {}

  // Optional: load and preview in template / console
  loadLessons() {
    this.lessonsService.getLessons().subscribe({
      next: (lessons) => {
        this.lessons = lessons;
        console.log('Generated lessons', lessons);
      },
      error: (err) => console.error('Error generating lessons', err),
    });
  }

  // Main action: download JSON
  downloadLessonsJson() {
    this.lessonsService.getLessons().subscribe({
      next: (lessons) => {
        const dataStr = JSON.stringify(lessons, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'B1-lessons-by-topic.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error generating lessons for download', err),
    });
  }
}
