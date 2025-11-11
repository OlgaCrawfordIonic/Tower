/*import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-unit-voyage',
  templateUrl: './unit-voyage.page.html',
  styleUrls: ['./unit-voyage.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class UnitVoyagePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}*/
import { Component, computed, signal } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonChip, IonLabel,
  IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonProgressBar
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

type StepType = 'learn' | 'listen' | 'meaning' | 'spelling' | 'revision' | 'final';
type StepStatus = 'locked' | 'next' | 'in-progress' | 'done';

interface Step {
  id: string;
  label: string;
  subtitle: string;
  type: StepType;
  status: StepStatus;
  y: number;     // absolute position (px) along the path
}

@Component({
  selector: 'app-unit-voyage',
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonChip, IonLabel, IonIcon,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonProgressBar
  ],
  templateUrl: './unit-voyage.page.html',
  styleUrls: ['./unit-voyage.page.scss']
})
export class UnitVoyagePage {
  readonly totalWords = 10;
  mastered = signal(3); // demo value
  harborOffset = 0; // space below last buoy
harborTop = computed(() => this.steps()[this.steps().length - 1].y + this.harborOffset);
contentMinHeight = computed(() => this.harborTop() + 360); // ensure container is tall enough


  steps = signal<Step[]>([
    { id: 's1', label: 'Learn', subtitle: '5 new words', type: 'learn', status: 'next', y: 180 },
    { id: 's2', label: 'Listen', subtitle: 'Hear & repeat', type: 'listen', status: 'next', y: 380 },
    { id: 's3', label: 'Meaning', subtitle: 'Match meanings', type: 'meaning', status: 'locked', y: 580 },
    { id: 's4', label: 'Spelling + meaning', subtitle: 'Type the word', type: 'spelling', status: 'locked', y: 780 },
    { id: 's5', label: 'Revision', subtitle: 'Quick mixed quiz', type: 'revision', status: 'locked', y: 980 },
    { id: 's6', label: 'Learn', subtitle: 'Next 5 words', type: 'learn', status: 'locked', y: 1200 },
    { id: 's7', label: 'Final revision', subtitle: 'All 10 words', type: 'final', status: 'locked', y: 1420 }
  ]);

  progress = computed(() => this.mastered() / this.totalWords);

  start(step: Step) {
    // hook up your navigation/modal here
    // For the visual demo, mark the current as done and unlock the next
    const arr = [...this.steps()];
    const idx = arr.findIndex(s => s.id === step.id);
    if (idx >= 0) {
      arr[idx] = { ...arr[idx], status: 'done' };
      if (arr[idx + 1]) arr[idx + 1] = { ...arr[idx + 1], status: 'next' };
      this.steps.set(arr);
    }
  }
}

