import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamListPage } from './exam-list-page';

describe('ExamListPage', () => {
  let component: ExamListPage;
  let fixture: ComponentFixture<ExamListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ExamListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
