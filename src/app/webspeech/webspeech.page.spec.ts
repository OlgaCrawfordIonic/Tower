import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebspeechPage } from './webspeech.page';

describe('WebspeechPage', () => {
  let component: WebspeechPage;
  let fixture: ComponentFixture<WebspeechPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WebspeechPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
