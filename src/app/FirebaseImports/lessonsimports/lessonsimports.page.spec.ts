import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LessonsimportsPage } from './lessonsimports.page';

describe('LessonsimportsPage', () => {
  let component: LessonsimportsPage;
  let fixture: ComponentFixture<LessonsimportsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonsimportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
