import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WordsPage } from './words.page';

describe('WordsPage', () => {
  let component: WordsPage;
  let fixture: ComponentFixture<WordsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
