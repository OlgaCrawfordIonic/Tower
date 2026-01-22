import { TestBed } from '@angular/core/testing';

import { LemmaLoaderService } from './lemma-loader.service';

describe('LemmaLoaderService', () => {
  let service: LemmaLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LemmaLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
