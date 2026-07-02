import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerSheetUploadPreview } from './answer-sheet-upload-preview';

describe('AnswerSheetUploadPreview', () => {
  let component: AnswerSheetUploadPreview;
  let fixture: ComponentFixture<AnswerSheetUploadPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerSheetUploadPreview],
    }).compileComponents();

    fixture = TestBed.createComponent(AnswerSheetUploadPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
