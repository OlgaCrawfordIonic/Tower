import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KessonsSlides1Page } from './kessons-slides1.page';

describe('KessonsSlides1Page', () => {
  let component: KessonsSlides1Page;
  let fixture: ComponentFixture<KessonsSlides1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KessonsSlides1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
