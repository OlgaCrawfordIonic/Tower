import { Component } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink],
})
export class HomePage {
  constructor(private router:Router) {}

lemmadetail(){
  this.router.navigate(['/lemma-detail'], {
  queryParams: {
    lemma: 'restore',
    level: 'B1',
    r2PublicBase: 'https://audio.lingoapp.io/'
  }
});
}
}
