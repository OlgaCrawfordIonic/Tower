import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewwordsPage } from './reviewwords.page';

describe('ReviewwordsPage', () => {
  let component: ReviewwordsPage;
  let fixture: ComponentFixture<ReviewwordsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewwordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
