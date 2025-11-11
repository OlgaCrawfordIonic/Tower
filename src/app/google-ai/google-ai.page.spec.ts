import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleAIPage } from './google-ai.page';

describe('GoogleAIPage', () => {
  let component: GoogleAIPage;
  let fixture: ComponentFixture<GoogleAIPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleAIPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
