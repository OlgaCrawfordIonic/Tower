import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentJsonToolsPage } from './content-json-tools.page';

describe('ContentJsonToolsPage', () => {
  let component: ContentJsonToolsPage;
  let fixture: ComponentFixture<ContentJsonToolsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentJsonToolsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
