import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeximatewordsPage } from './leximatewords.page';

describe('LeximatewordsPage', () => {
  let component: LeximatewordsPage;
  let fixture: ComponentFixture<LeximatewordsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LeximatewordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
