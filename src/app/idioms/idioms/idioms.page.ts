import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

type Idioms = {
  id: number;
  idiom: string;
  definition:string;
  origin:string;
  examples: string[];
  };

@Component({
  selector: 'app-idioms',
  templateUrl: './idioms.page.html',
  styleUrls: ['./idioms.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class IdiomsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
