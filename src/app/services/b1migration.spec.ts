import { TestBed } from '@angular/core/testing';

import { B1migration } from './b1migration';

describe('B1migration', () => {
  let service: B1migration;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(B1migration);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
