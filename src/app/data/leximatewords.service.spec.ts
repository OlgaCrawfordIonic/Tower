import { TestBed } from '@angular/core/testing';

import { LeximatewordsService } from './leximatewords.service';

describe('LeximatewordsService', () => {
  let service: LeximatewordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeximatewordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
