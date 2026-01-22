import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  playCircleOutline,
  pauseCircleOutline,
  codeSlashOutline,
  cloudUploadOutline
} from 'ionicons/icons';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  
    providers: [
      
      ]
})
export class AppComponent {
  constructor() {

     addIcons({
      'play-circle-outline': playCircleOutline,
      'pause-circle-outline': pauseCircleOutline,
      'code-slash-outline': codeSlashOutline,
      'cloud-upload-outline': cloudUploadOutline

    });
  }
}
