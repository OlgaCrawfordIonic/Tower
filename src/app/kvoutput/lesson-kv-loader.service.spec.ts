import { TestBed } from '@angular/core/testing';

import { LessonKvLoaderService } from './lesson-kv-loader.service';

describe('LessonKvLoaderService', () => {
  let service: LessonKvLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LessonKvLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
