import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,IonBackButton, IonItem, IonLabel, IonSelect, IonTextarea, IonSelectOption} from '@ionic/angular/standalone';

@Component({
  selector: 'app-webspeech',
  templateUrl: './webspeech.page.html',
  styleUrls: ['./webspeech.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonButton,IonBackButton, IonItem, IonLabel, IonSelect, IonTextarea, IonSelectOption]
})
export class WebspeechPage implements OnInit {
  textToSpeak: string = '';
  voices: SpeechSynthesisVoice[] = [];
  selectedVoice: SpeechSynthesisVoice | null = null;
  constructor() {
     // Load available voices
     this.loadVoices();
  }

  loadVoices() {
    // Fetch the available voices from the browser
    window.speechSynthesis.onvoiceschanged = () => {
      this.voices = window.speechSynthesis.getVoices();
    };
  }

  speakText() {
    if (this.textToSpeak.trim() !== '') {
      const utterance = new SpeechSynthesisUtterance(this.textToSpeak);
      
      // Optionally set the voice (you can let the user choose)
     // utterance.voice = this.voices.find(voice => voice.name === 'Google US English');
     utterance.voice = this.selectedVoice ?? null;
      
      utterance.lang = 'en-UK'; // Set the language
      utterance.rate = 1;       // Set the speed (1 is normal, 0.5 is half speed, 2 is double speed)
      utterance.pitch = 1;      // Set the pitch (1 is normal, 0.5 is lower, 2 is higher)

      window.speechSynthesis.speak(utterance);
    }
  }

  ngOnInit() {
  }

}
