import { TestBed } from '@angular/core/testing';

import { WordTopicUtil } from './word-topic.util';

describe('WordTopicUtil', () => {
  let service: WordTopicUtil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordTopicUtil);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
