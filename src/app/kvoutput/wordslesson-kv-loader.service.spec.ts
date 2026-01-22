import { TestBed } from '@angular/core/testing';

import { WordslessonKvLoaderService } from './wordslesson-kv-loader.service';

describe('WordslessonKvLoaderService', () => {
  let service: WordslessonKvLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordslessonKvLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
