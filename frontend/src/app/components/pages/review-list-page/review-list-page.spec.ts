import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewListPage } from './review-list-page';

describe('ReviewListPage', () => {
  let component: ReviewListPage;
  let fixture: ComponentFixture<ReviewListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
