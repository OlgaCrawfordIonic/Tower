import { TestBed } from '@angular/core/testing';

import { LessonsKvStateService } from './lessons-kv-state.service';

describe('LessonsKvStateService', () => {
  let service: LessonsKvStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonsKvStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
