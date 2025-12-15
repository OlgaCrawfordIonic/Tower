import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportfirebasePage } from './importfirebase.page';

describe('ImportfirebasePage', () => {
  let component: ImportfirebasePage;
  let fixture: ComponentFixture<ImportfirebasePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportfirebasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
