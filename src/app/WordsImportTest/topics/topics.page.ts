import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonList,IonItemDivider,IonLabel, IonItem, IonButton, IonButtons } from '@ionic/angular/standalone';
import { TopicGroup } from '../word-topic.util';
import { WordTopicService } from '../word-topic';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.page.html',
  styleUrls: ['./topics.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonList,IonItemDivider,IonLabel, IonItem, IonButton, IonButtons ]
})
export class TopicsPage implements OnInit {
  topicGroups: TopicGroup[] = [];

  constructor(private wordTopicService: WordTopicService) {}

  ngOnInit() {
    this.wordTopicService.getGroupedTopics().subscribe({
      next: (groups) => {
        this.topicGroups = groups;
      },
      error: (err) => {
        console.error('Error loading words file', err);
      }
    });
  }
  // ⬇️ Function to download the grouped JSON file
  downloadTopicsJson() {
    if (!this.topicGroups || this.topicGroups.length === 0) {
      console.warn('No topic groups to download yet.');
      return;
    }

    const dataStr = JSON.stringify(this.topicGroups, null, 2); // pretty-print
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'B1words-by-topics.json'; // file name for download
    document.body.appendChild(a); // Firefox fix
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
