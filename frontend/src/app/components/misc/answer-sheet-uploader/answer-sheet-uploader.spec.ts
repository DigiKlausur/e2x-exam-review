import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerSheetUploader } from './answer-sheet-uploader';

describe('AnswerSheetUploader', () => {
  let component: AnswerSheetUploader;
  let fixture: ComponentFixture<AnswerSheetUploader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerSheetUploader],
    }).compileComponents();

    fixture = TestBed.createComponent(AnswerSheetUploader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
