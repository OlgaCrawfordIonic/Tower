import { Component, Input, Output, ViewChild,ElementRef,computed, signal, EventEmitter } from '@angular/core';
import { IonicSlides } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import {
  IonButton, IonIcon, IonLabel, IonText
} from '@ionic/angular/standalone';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {Swiper}from 'swiper';

@Component({
  selector: 'app-lesson-slide',
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, IonLabel, IonText],
  templateUrl: './lesson-slide.component.html',
  styleUrls: ['./lesson-slide.component.scss'],
   schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class LessonSlideComponent {
   @ViewChild('swiper', { static: false }) swiperRef: ElementRef | undefined;
    @Output() nextSlide = new EventEmitter<void>(); 
  slides?:Swiper;
   swiperModules = [IonicSlides];
  @Input() word = 'composition';
  @Input() ipa = '/ˌkɒmpəˈzɪʃən/';
  @Input() def = 'the way something is put together; a piece of writing.';
  @Input() ex  = 'The essay showed strong composition and structure.';
  @Input() index = 1;             // slide number (1-based)
  @Input() total = 10;

  // expose resolved asset URLs if you prefer Vite’s resolution:
  
  // Reactive signal for current index
  currentIndex = signal(0);
  // stub actions
  speak() {}
  record() {}
  // Configure IonicSlides module for smooth defaults
 

  // Called after Swiper init (from (afterinit) event)
  onSwiperInit() {
  
    this.slides = this.swiperRef?.nativeElement.swiper;
    
  }


  

    onSlideDidChange(event: any) {
    const idx = event.target.swiper.activeIndex;
    this.currentIndex.set(idx ?? 0);
  }

   next() {
    
    this.nextSlide.emit();  // Emit the event when Next is clicked
  }

   prev() {
  this.slides?.slidePrev();
  }
}
