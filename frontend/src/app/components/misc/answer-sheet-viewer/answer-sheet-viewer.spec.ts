import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerSheetViewer } from './answer-sheet-viewer';

describe('AnswerSheetViewer', () => {
  let component: AnswerSheetViewer;
  let fixture: ComponentFixture<AnswerSheetViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerSheetViewer],
    }).compileComponents();

    fixture = TestBed.createComponent(AnswerSheetViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
