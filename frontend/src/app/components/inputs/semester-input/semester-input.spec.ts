import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterInput } from './semester-input';

describe('SemesterInput', () => {
  let component: SemesterInput;
  let fixture: ComponentFixture<SemesterInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemesterInput],
    }).compileComponents();

    fixture = TestBed.createComponent(SemesterInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
