import { Component, OnDestroy, OnInit , ViewChild, ElementRef} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import{ IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { WordsService } from '../data/words/words.service'
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Word, PartOfSpeech, Definition  } from '../data/words/words.model';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { IonicSlides } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import Swiper from 'swiper';
import { TexttoSpeechService } from '../textto-speech.service';


type SliderItem = {
  word: string;
  partsOfSpeech: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      examples: string[];
    }[];
  }[];
};

@Component({
  selector: 'app-words',
  templateUrl: './words.page.html',
  styleUrls: ['./words.page.scss'],
  standalone: true,
  imports: [ IonContent, IonHeader, IonTitle, IonToolbar ,CommonModule, FormsModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class WordsPage implements OnInit, OnDestroy {
  @ViewChild('swiper', { static: false }) swiperRef: ElementRef | undefined;
  swiper?:Swiper;
currentIndex=0;
swiperModules = [IonicSlides];  
subsetWords: Word[] = [];
word!: Word
wordsSub!:Subscription;
sliderItems: SliderItem[]=[];
private currentAudio: HTMLAudioElement | null = null; // Track the current audio
  constructor(private wordsService: WordsService, private ttsService:TexttoSpeechService) { }

 /* ngOnInit() {
    this.wordsSub=this.wordsService.words.subscribe((words) => {this.word=words[0];
      setTimeout(() => {
        this.readAloud();
      }, 2000);  
    })
  }
  ngOnDestroy(): void {
    if(this.wordsSub) {
      this.wordsSub.unsubscribe();
    }
  }*/

    indexIs(slideN:number){
      console.log('sledN' + slideN);
      const activeIndex=slideN;
      const currentWord = this.subsetWords[activeIndex];

    // Construct the text for the current word
    let textToRead = this.constructTextForWord(currentWord);

    

    // Perform additional actions, such as triggering text-to-speech
   this.readAloud(textToRead);
    }

    getWords() {
      this.wordsSub = this.wordsService.subsetWords.subscribe((words) => {
        if (words && words.length > 0) {
          this.subsetWords = words;
    
          // Transform the subsetWords into the structure needed for Swiper
          this.sliderItems = this.subsetWords.map(word => ({
             word: word.word,
            partsOfSpeech: word.partsOfSpeech.map(partOfSpeech => ({
              partOfSpeech: partOfSpeech.partOfSpeech,
              definitions: partOfSpeech.definitions.map(definition => ({
                definition: definition.definition,
                examples: definition.examples
              
              }))
            }))
          }));
    
          console.log('Slider Items:', this.sliderItems);
        } else {
          console.error('No words available to create slider items');
        }
      });

    }
    

    ngOnInit() {
    /*  this.wordsSub = this.wordsService.subsetWords.subscribe((words) => {
        this.subsetWords = words;
        console.log(this.subsetWords)
      });*/

      this.getWords();

      this.onSlideLoad(this.swiper);
      

      
    }
  
    ngOnDestroy(): void {
      if (this.wordsSub) {
        this.wordsSub.unsubscribe();
      }
    }

  


  onSlideChangeOld(swiper: any) {
   
    const activeIndex = this.swiperRef?.nativeElement.swiper.activeIndex;
    console.log('Active Index:', activeIndex);
}

onSlideChange1(event: any) {
  const activeIndex = this.swiperRef?.nativeElement.swiper.activeIndex;
  this.currentIndex=activeIndex;
  console.log('Active Index:', activeIndex);
  //const activeIndex = event.activeIndex;
  if (activeIndex >= 0 && activeIndex < this.subsetWords.length) {
    const currentWord = this.subsetWords[activeIndex];

    // Delay the text-to-speech by 2 seconds after the slide change
    setTimeout(() => {
     // this.readAloud(currentWord);
    }, 2000);
  } else {
    console.error('Active index is out of bounds');
  }
}

onSlideChange(event: any) {
  // Retrieve the active index from the Swiper instance
  const activeIndex = this.swiperRef?.nativeElement.swiper.activeIndex;
  this.currentIndex = activeIndex;

  console.log('Active Index:', activeIndex);

  // Ensure the active index is within the valid range
  if (activeIndex >= 0 && activeIndex < this.subsetWords.length) {
    // Get the word corresponding to the active index
    const currentWord = this.subsetWords[activeIndex];

    // Construct the text for the current word
    let textToRead = this.constructTextForWord(currentWord);

    

    // Perform additional actions, such as triggering text-to-speech
   //this.readAloud(textToRead);
  } else {
    console.error('Active index is out of bounds');
  }
}
// Separate method to construct the text for a given word
private constructTextForWord(word: Word): string {
  let text = `${word.word}. `;
  
  word.partsOfSpeech.forEach((partOfSpeech) => {
    text += `As a ${partOfSpeech.partOfSpeech}: `;
    
    partOfSpeech.definitions.forEach((definition, index) => {
      text += this.constructTextForDefinition(definition, index);
    });
  });

  return text;
}

private constructTextForDefinition(definition: Definition, index: number): string {
  let text = '';
  
  if (definition) {
    if (index > 0) {
      text += `Definition ${index + 1}: `;
    }
    text += `${definition.definition}. `;
    
    if (definition.examples && definition.examples.length > 0) {
      text += `Examples: `;
      definition.examples.forEach((example) => {
        text += `${example}. `;
      });
    }
  }
  
  return text;
}


onSlideLoad(event: any) {
  const activeIndex = 0;
  console.log('Active Index:', activeIndex);
  //const activeIndex = event.activeIndex;
  if (activeIndex >= 0 && activeIndex < this.subsetWords.length) {
    const currentWord = this.subsetWords[0];
     // Get the word corresponding to the active index
    
     // Construct the text for the current word
     let textToRead = this.constructTextForWord(currentWord);
 
     

    // Delay the text-to-speech by 2 seconds after the slide change
    setTimeout(() => {
      this.readAloud(textToRead);
    }, 4000);
  } else {
    console.error('Active index is out of bounds');
  }
}



async readAloud(textToRead: string) {
  
  if (!textToRead) return;

  if (this.currentAudio) {
    this.currentAudio.pause();
    this.currentAudio = null;
  }

  // Generate and play the speech using the synthesizeSpeech function
  this.ttsService.synthesizeSpeech(textToRead).subscribe({
    next: (response) => {
      const audioContent = response.audioContent;
      this.currentAudio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      this.currentAudio.play();
    },
    error: (error) => {
      console.error('Error occurred during speech synthesis:', error);
    }
  });
}



async readAloud1(word: Word) {
  if (!word) return;

  // Stop the current audio if it is playing
  if (this.currentAudio) {
    this.currentAudio.pause();
    this.currentAudio = null; // Clear the reference to the current audio
  }

  // Construct the text to read
  let textToRead = `Word: ${word.word}. `;
  word.partsOfSpeech.forEach((partOfSpeech) => {
    textToRead += `As a ${partOfSpeech.partOfSpeech}: `;
    partOfSpeech.definitions.forEach((definition, index) => {
      if (partOfSpeech.definitions.length > 1) {
        textToRead += `Definition ${index + 1}: `;
      }
      textToRead += `${definition.definition}. Examples: `;
      definition.examples.forEach((example) => {
        textToRead += `${example}. `;
      });
    });
  });

  // Generate and play the speech using the synthesizeSpeech function
  this.ttsService.synthesizeSpeech(textToRead).subscribe({
    next: (response) => {
      const audioContent = response.audioContent;
      this.currentAudio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      this.currentAudio.play();
    },
    error: (error) => {
      console.error('Error occurred during speech synthesis:', error);
    }
  });
}


}

/*async readAloudPlugin() {
    if (!this.word) return;

    // Construct the text to read
    let textToRead = `  ${this.word.word}. `;
    this.word.partsOfSpeech.forEach((partOfSpeech) => {
      textToRead += ` As  a ${partOfSpeech.partOfSpeech}: `;
      partOfSpeech.definitions.forEach((definition, index) => {
        if (partOfSpeech.definitions.length > 0) {
          textToRead += `Definition ${index + 1}: `;
        }
        textToRead += `${definition.definition}. Examples: `;
        definition.examples.forEach((example) => {
          textToRead += `${example}. `;
        });
      });
    });

    // Use the TextToSpeech plugin to read the text aloud
    await TextToSpeech.speak({
      text: textToRead,
     // lang: 'en-GB', // British English (you can change this as needed)
     // rate: 0.6,
     // pitch: 0.7,
     voice:159
    });
  }*/
