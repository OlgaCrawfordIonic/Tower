import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditwordPage } from './editword.page';

describe('EditwordPage', () => {
  let component: EditwordPage;
  let fixture: ComponentFixture<EditwordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditwordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
