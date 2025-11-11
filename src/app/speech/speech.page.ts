import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Component({
  selector: 'app-speech',
  templateUrl: './speech.page.html',
  styleUrls: ['./speech.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonButton, IonButtons, IonBackButton ]
})
export class SpeechPage implements OnInit {
  public supportedLanguages: string[] = [];
  public supportedVoices: SpeechSynthesisVoice[] = [];
  constructor() { }

  speakTest(){
    TextToSpeech.speak({
     text: 'characteristic of one person or thing, and so serving to distinguish it from others. The distinctive aroma of fresh coffee filled the room. Her voice is quite distinctive, making her easily recognizable on the radio.characteristic of one person or thing, and so serving to distinguish it from others. The distinctive aroma of fresh coffee filled the room. Her voice is quite distinctive, making her easily recognizable on the radio.characteristic of one person or thing, and so serving to distinguish it from others. The distinctive aroma of fresh coffee filled the room. Her voice is quite distinctive, making her easily recognizable on the radio.characteristic of one person or thing, and so serving to distinguish it from others. The distinctive aroma of fresh coffee filled the room. Her voice is quite distinctive, making her easily recognizable on the radio.characteristic of one person or thing, and so serving to distinguish it from others. The distinctive aroma of fresh coffee filled the room. Her voice is quite distinctive, making her easily recognizable on the radio.characteristic of one person or thing, and so serving to distinguish it from others. The distinctive aroma of fresh coffee filled the room. Her voice is quite distinctive, making her easily recognizable on the radio.characteristic of one person or thing, and so serving to distinguish it from others. The distinctive aroma of fresh coffee filled the room. Her voice is quite distinctive, making her easily recognizable on the radio.characteristic of one person or thing, and so serving to distinguish it from others. The distinctive aroma of fresh coffee filled the room. Her voice is quite distinctive, making her easily recognizable on the radio.',
     lang: 'en-GB'
     
 
   });
 }

  public ngOnInit(): void {
    
    TextToSpeech.getSupportedVoices().then(result => {
      this.supportedVoices = result.voices;
      console.log(this.supportedVoices)
    });
   
  }

}
