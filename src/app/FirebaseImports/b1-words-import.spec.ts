import { TestBed } from '@angular/core/testing';

import { B1WordsImport } from './b1-words-import';

describe('B1WordsImport', () => {
  let service: B1WordsImport;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(B1WordsImport);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
