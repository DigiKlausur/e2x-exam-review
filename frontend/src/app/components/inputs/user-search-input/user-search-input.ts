import { Component } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {IUser} from 'e2xgrader-review-backend';

@Component({
  selector: 'app-user-search-input',
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: UserSearchInput,
      multi: true
    }
  ],
  templateUrl: './user-search-input.html',
  styleUrl: './user-search-input.scss',
})
export class UserSearchInput implements ControlValueAccessor {
  protected currentValue: IUser | undefined;

  onChange: (value: IUser | undefined) => any = (value: IUser | undefined) => {};
  onTouched: () => any = () => {};

  registerOnChange(fn: (value: IUser | undefined) => any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => any): void {
    this.onTouched = fn;
  }

  writeValue(val: IUser | undefined): void {
    this.currentValue = val;
  }

  handleValueChange(): void{
    this.onChange(this.currentValue);
  }
}
