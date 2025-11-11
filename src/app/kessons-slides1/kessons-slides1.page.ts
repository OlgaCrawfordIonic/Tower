import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-kessons-slides1',
  templateUrl: './kessons-slides1.page.html',
  styleUrls: ['./kessons-slides1.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class KessonsSlides1Page implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
