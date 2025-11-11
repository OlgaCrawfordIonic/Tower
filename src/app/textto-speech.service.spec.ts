import { TestBed } from '@angular/core/testing';

import { TexttoSpeechService } from './textto-speech.service';

describe('TexttoSpeechService', () => {
  let service: TexttoSpeechService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TexttoSpeechService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
