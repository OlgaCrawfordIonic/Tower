import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnitVoyage1Page } from './unit-voyage1.page';

describe('UnitVoyage1Page', () => {
  let component: UnitVoyage1Page;
  let fixture: ComponentFixture<UnitVoyage1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitVoyage1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
