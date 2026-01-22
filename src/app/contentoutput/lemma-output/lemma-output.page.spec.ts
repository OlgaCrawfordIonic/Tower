import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LemmaOutputPage } from './lemma-output.page';

describe('LemmaOutputPage', () => {
  let component: LemmaOutputPage;
  let fixture: ComponentFixture<LemmaOutputPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LemmaOutputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
