import {Component} from '@angular/core';
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DateTimeInput} from '../date-time-input/date-time-input.component';

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
export class DateInput extends DateTimeInput {
  override handleValueChange(): void{
    if(this.currentDate) this.currentValue = new Date(this.currentDate.year, this.currentDate.month - 1, this.currentDate.day, 0, 0, 0);
    else this.currentValue = null;
    this.onChange(this.currentValue);
  }
}
