import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LessonsSlides1Page } from './lessons-slides1.page';

describe('LessonsSlides1Page', () => {
  let component: LessonsSlides1Page;
  let fixture: ComponentFixture<LessonsSlides1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonsSlides1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
