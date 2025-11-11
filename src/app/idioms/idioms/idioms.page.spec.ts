import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdiomsPage } from './idioms.page';

describe('IdiomsPage', () => {
  let component: IdiomsPage;
  let fixture: ComponentFixture<IdiomsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IdiomsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
