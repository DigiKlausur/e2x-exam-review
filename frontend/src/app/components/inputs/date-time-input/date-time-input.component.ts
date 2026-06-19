import {Component} from '@angular/core';
import {
  NgbDateStruct,
  NgbInputDatepicker, NgbTimepicker, NgbTimeStruct
} from "@ng-bootstrap/ng-bootstrap";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import { CustomInput } from '../../../directives/custom-input/custom-input';

@Component({
  selector: 'app-date-time-input',
  imports: [
    NgbInputDatepicker,
    FormsModule,
    NgbTimepicker
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DateTimeInput,
      multi: true
    }
  ],
  templateUrl: './date-time-input.component.html',
  styleUrl: './date-time-input.component.scss',
})
export class DateTimeInput extends CustomInput implements ControlValueAccessor {
  protected currentValue: Date | null = null;
  protected currentDate: NgbDateStruct | null = null;
  protected currentTime: NgbTimeStruct | null = null;

  onChange: (value: Date|null) => any = () => {};
  onTouched: () => any = () => {};

  registerOnChange(fn: (value: Date|null) => any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => any): void {
    this.onTouched = fn;
  }

  writeValue(val: Date|null): void {
    this.currentValue = val;
    this.currentTime = val ? {hour: val.getHours(), minute: val.getMinutes(), second: val.getSeconds()} : null;
    this.currentDate = val ? {year: val.getFullYear(), month: val.getMonth() + 1, day: val.getDate()} : null;
  }

  handleValueChange(): void{
    if(this.currentDate && this.currentTime) this.currentValue = new Date(this.currentDate.year, this.currentDate.month - 1, this.currentDate.day, this.currentTime.hour, this.currentTime.minute, this.currentTime.second);
    else this.currentValue = null;
    this.onChange(this.currentValue);
  }
}
