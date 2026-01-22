// src/app/pages/lemma-detail/lemma-detail.page.ts
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonSegment, IonSegmentButton, IonLabel, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonButton, IonIcon, IonList, IonItem, IonBadge, IonTitle, IonToolbar,IonHeader
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ActivatedRoute } from '@angular/router';
import { playCircleOutline, pauseCircleOutline } from 'ionicons/icons';
import { AudioService } from '../audio';
import { LemmaLoaderService } from '../lemma-loader.service';
import { environment } from '../../../environments/environment';

type Locale = 'en-GB' | 'en-US';

@Component({
  standalone: true,
  selector: 'app-lemma-detail',
  templateUrl: './lemma-detail.page.html',
  styleUrls: ['./lemma-detail.page.scss'],
  imports: [ IonTitle, IonToolbar,IonHeader,
    CommonModule,
    IonContent, IonSegment, IonSegmentButton, IonLabel,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonButton, IonIcon, IonList, IonItem, IonBadge
  ]
})
export class LemmaDetailPage implements OnInit {
  private audio = inject(AudioService);
  private loader = inject(LemmaLoaderService);

  @Input() lemma = '';                // e.g., "flat"
  @Input() level = environment.defaultLevel; // e.g., "B1"
  @Input() r2PublicBase = environment.r2PublicBase;

  doc: any | null = null;
  locale = signal<Locale>('en-GB');

  constructor(private route: ActivatedRoute) {
    addIcons({ playCircleOutline, pauseCircleOutline });
  }

 async ngOnInit() {
  // read query params, then load
  this.route.queryParamMap.subscribe(async (qp) => {
    this.lemma = (qp.get('lemma') || '').trim();
    this.level = (qp.get('level') || 'B1').trim();
    this.r2PublicBase = (qp.get('r2PublicBase') || 'https://audio.lingoapp.io/')
      .replace(/\/?$/, '/');

    if (!this.lemma) {
      console.warn('No lemma param provided');
      this.doc = null;
      return;
    }

    try {
      this.doc = await this.loader.load(this.lemma, this.level);
      // console.log('Loaded', this.lemma, this.doc);
    } catch (err) {
      console.error('KV load error', err);
      this.doc = null;
    }
  });
}

  setLocale(loc: Locale) { this.locale.set(loc); }

  // --- URL builder: prepend R2 base to KV paths
  audioUrl(key?: string | null) {
    return key ? (this.r2PublicBase + key) : '';
  }

  // --- Text fallback for definition objects
  defFor(loc: Locale, defObj: any) {
    const gb = defObj?.['en-GB']; const us = defObj?.['en-US'];
    if (loc === 'en-GB') return gb ?? null;
    if (us?.text?.trim()) return us;
    if (!gb) return us ?? null;
    return { ...gb, audioUrl: us?.audioUrl ?? gb.audioUrl };
  }

  // --- Array fallback for examples/topics (per index)
  withFallbackExamples(gbArr: any[] | undefined, usArr: any[] | undefined, loc: Locale) {
    if (loc === 'en-GB') return gbArr ?? [];
    const gb = gbArr ?? []; const us = usArr ?? [];
    const max = Math.max(gb.length, us.length);
    const out: any[] = [];
    for (let i = 0; i < max; i++) {
      const g = gb[i]; const u = us[i];
      if (u?.text?.trim()) out.push(u);
      else if (g) out.push({ ...g, audioUrl: u?.audioUrl ?? g.audioUrl, text: g.text });
    }
    return out;
  }

  isPlaying(key?: string | null) { return this.audio.isPlaying(this.audioUrl(key || '')); }
  play(key?: string | null) { if (key) this.audio.play(this.audioUrl(key)); }

// Add this method to LemmaDetailPage
onLocaleChange(ev: any) {
  const v = ev?.detail?.value as string | undefined;
  if (v === 'en-GB' || v === 'en-US') {
    this.setLocale(v);
  } else {
    // fallback if undefined/unknown
    this.setLocale('en-GB');
  }
}

}
