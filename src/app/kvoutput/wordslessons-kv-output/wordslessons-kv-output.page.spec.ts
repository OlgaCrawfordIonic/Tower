import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WordslessonsKvOutputPage } from './wordslessons-kv-output.page';

describe('WordslessonsKvOutputPage', () => {
  let component: WordslessonsKvOutputPage;
  let fixture: ComponentFixture<WordslessonsKvOutputPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WordslessonsKvOutputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
