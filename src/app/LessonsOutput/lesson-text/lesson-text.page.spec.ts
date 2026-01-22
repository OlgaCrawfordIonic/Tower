import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LessonTextPage } from './lesson-text.page';

describe('LessonTextPage', () => {
  let component: LessonTextPage;
  let fixture: ComponentFixture<LessonTextPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonTextPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
