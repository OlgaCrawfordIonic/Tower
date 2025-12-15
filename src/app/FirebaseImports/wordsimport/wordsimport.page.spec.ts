import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WordsimportPage } from './wordsimport.page';

describe('WordsimportPage', () => {
  let component: WordsimportPage;
  let fixture: ComponentFixture<WordsimportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WordsimportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
