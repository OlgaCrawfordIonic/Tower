import { TestBed } from '@angular/core/testing';

import { B1LessonsImport } from './b1-lessons-import';

describe('B1LessonsImport', () => {
  let service: B1LessonsImport;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(B1LessonsImport);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
