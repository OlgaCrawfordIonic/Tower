import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LemmaDetailPage } from './lemma-detail.page';

describe('LemmaDetailPage', () => {
  let component: LemmaDetailPage;
  let fixture: ComponentFixture<LemmaDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LemmaDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
