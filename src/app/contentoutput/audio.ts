// src/app/services/audio.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private audio = new Audio();
  private currentUrl: string | null = null;

  play(url: string) {
    if (!url) return;
    if (this.currentUrl === url && !this.audio.paused) {
      this.audio.pause();
      return;
    }
    this.currentUrl = url;
    this.audio.src = url;
    this.audio.load();
    this.audio.play().catch(() => {});
  }

  stop() {
    this.audio.pause();
  }

  isPlaying(url: string) {
    return this.currentUrl === url && !this.audio.paused;
  }
}
