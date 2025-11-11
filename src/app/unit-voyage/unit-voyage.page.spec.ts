import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnitVoyagePage } from './unit-voyage.page';

describe('UnitVoyagePage', () => {
  let component: UnitVoyagePage;
  let fixture: ComponentFixture<UnitVoyagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitVoyagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
