import { TestBed } from '@angular/core/testing';

import { WordslessonsKvStateService } from './wordslessons-kv-state.service';

describe('WordslessonsKvStateService', () => {
  let service: WordslessonsKvStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordslessonsKvStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
