import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { TexttoSpeechService } from '../textto-speech.service'

@Component({
  selector: 'app-google-ai',
  templateUrl: './google-ai.page.html',
  styleUrls: ['./google-ai.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonBackButton]
})
export class GoogleAIPage implements OnInit {
 
  constructor(private ttsService: TexttoSpeechService) { }
  generateSpeech() {
    this.ttsService.synthesizeSpeech('Most Americans who know about Project 2025 consume it in bite-size pieces, .').subscribe((response) => {
      const audioContent = response.audioContent;
      const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      audio.play();
    });
  
  }
  ngOnInit() {
  }

}
