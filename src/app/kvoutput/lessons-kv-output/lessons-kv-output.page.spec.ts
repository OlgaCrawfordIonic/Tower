import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LessonsKvOutputPage } from './lessons-kv-output.page';

describe('LessonsKvOutputPage', () => {
  let component: LessonsKvOutputPage;
  let fixture: ComponentFixture<LessonsKvOutputPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonsKvOutputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
