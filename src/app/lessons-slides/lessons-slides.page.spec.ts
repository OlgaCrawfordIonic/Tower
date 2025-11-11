import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LessonsSlidesPage } from './lessons-slides.page';

describe('LessonsSlidesPage', () => {
  let component: LessonsSlidesPage;
  let fixture: ComponentFixture<LessonsSlidesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonsSlidesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
