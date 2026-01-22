import { TestBed } from '@angular/core/testing';

import { LessonStateService } from './lesson-state.service';

describe('LessonStateService', () => {
  let service: LessonStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
