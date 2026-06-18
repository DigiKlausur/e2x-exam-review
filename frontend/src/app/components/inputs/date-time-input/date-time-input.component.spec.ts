import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimeInput } from './date-time-input.component';

describe('DateInput', () => {
  let component: DateTimeInput;
  let fixture: ComponentFixture<DateTimeInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateTimeInput],
    }).compileComponents();

    fixture = TestBed.createComponent(DateTimeInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
