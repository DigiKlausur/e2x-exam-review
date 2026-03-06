import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerSheetList } from './answer-sheet-list';

describe('AnswerSheetList', () => {
  let component: AnswerSheetList;
  let fixture: ComponentFixture<AnswerSheetList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerSheetList],
    }).compileComponents();

    fixture = TestBed.createComponent(AnswerSheetList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
