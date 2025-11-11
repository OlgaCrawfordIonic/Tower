import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AmEngSlidePage } from './am-eng-slide.page';

describe('AmEngSlidePage', () => {
  let component: AmEngSlidePage;
  let fixture: ComponentFixture<AmEngSlidePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AmEngSlidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
