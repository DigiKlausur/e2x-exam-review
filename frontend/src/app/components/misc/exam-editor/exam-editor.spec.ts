import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamEditor } from './exam-editor';

describe('ExamEditor', () => {
  let component: ExamEditor;
  let fixture: ComponentFixture<ExamEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(ExamEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
