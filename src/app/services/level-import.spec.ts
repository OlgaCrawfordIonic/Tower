import { TestBed } from '@angular/core/testing';

import { LevelImport } from './level-import';

describe('LevelImport', () => {
  let service: LevelImport;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LevelImport);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
