import {Component} from '@angular/core';
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-date-input',
  imports: [
    NgbInputDatepicker,
    FormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DateInput,
      multi: true
    }
  ],
  templateUrl: './date-input.html',
  styleUrl: './date-input.scss',
})
export class DateInput implements ControlValueAccessor {
  protected currentValue: Date | null = null;

  onChange: (value: Date|null) => any = (value: Date|null) => {};
  onTouched: () => any = () => {};

  registerOnChange(fn: (value: Date|null) => any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => any): void {
    this.onTouched = fn;
  }

  writeValue(val: Date|null): void {
    this.currentValue = val;
  }

  handleValueChange(): void{
    this.onChange(this.currentValue);
  }
}
