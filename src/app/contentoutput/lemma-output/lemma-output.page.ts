import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-lemma-output',
  templateUrl: './lemma-output.page.html',
  styleUrls: ['./lemma-output.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LemmaOutputPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
