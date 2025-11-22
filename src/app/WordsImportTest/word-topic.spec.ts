import { TestBed } from '@angular/core/testing';

import { WordTopic } from './word-topic';

describe('WordTopic', () => {
  let service: WordTopic;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordTopic);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
