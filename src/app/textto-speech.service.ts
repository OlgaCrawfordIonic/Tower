import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TexttoSpeechService {
  private apiUrl = 'https://texttospeech.googleapis.com/v1/text:synthesize';
  private apiKey = environment.textTospeechAPI; // Replace with your actual API key

  constructor(private http: HttpClient) {}

  synthesizeSpeech(text: string): Observable<any> {
    const body = {
      input: { text: text },
      voice: { languageCode: 'en-GB',name:'en-GB-Chirp3-HD-Orus',ssmlGender: 'MALE' },//abcdf -standard voices
      audioConfig: { audioEncoding: 'MP3' },
    };
//en-GB-Chirp3-HD-Orus en-GB-Chirp3-HD-Laomedeia  en-GB-Neural2-B en-GB-Chirp3-HD-Vindemiatrix
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}?key=${this.apiKey}`, body, { headers });
  }
}
