import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamEditorPage } from './exam-editor-page';

describe('ExamEditorPage', () => {
  let component: ExamEditorPage;
  let fixture: ComponentFixture<ExamEditorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamEditorPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ExamEditorPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
