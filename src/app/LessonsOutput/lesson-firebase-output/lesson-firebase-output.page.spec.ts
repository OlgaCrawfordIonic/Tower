import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LessonFirebaseOutputPage } from './lesson-firebase-output.page';

describe('LessonFirebaseOutputPage', () => {
  let component: LessonFirebaseOutputPage;
  let fixture: ComponentFixture<LessonFirebaseOutputPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonFirebaseOutputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
