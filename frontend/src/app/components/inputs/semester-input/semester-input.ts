import {Component, inject, LOCALE_ID, OnInit} from '@angular/core';
import {ISemester, Season} from 'e2x-exam-review-backend';
import {getFullSemesterName} from '../../../utils/SemesterUtil';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import { CustomInput } from '../../../directives/custom-input/custom-input';

@Component({
  selector: 'app-semester-input',
  imports: [
    FormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SemesterInput,
      multi: true
    }
  ],
  templateUrl: './semester-input.html',
  styleUrl: './semester-input.scss',
})
export class SemesterInput extends CustomInput implements OnInit, ControlValueAccessor {
  private currentLocaleId: string = inject(LOCALE_ID);
  semesterOptions: {title: string; value: ISemester}[] = [];

  currentValue: ISemester | undefined;

  onChange: (value: ISemester|undefined) => any = () => {};
  onTouched: () => any = () => {};

  ngOnInit(): void {
    this.createSemesterOptions();
  }

  createSemesterOptions(): void {
    const seasons: Season[] = [Season.SUMMER, Season.WINTER];
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear() - (currentDate.getMonth() < 2 ? 1 : 0);
    const startSeason = currentDate.getMonth() < 2 || currentDate.getMonth() > 7  ? 1 : 0;
    for(let i = 0; i < 10; i++) { // iterate through the last 10 semesters
      const currentSeason: Season = seasons[(i+startSeason) % 2];
      const semester = {
        year: currentYear,
        season: currentSeason,
      };
      this.semesterOptions.push({
        title: getFullSemesterName(semester, this.currentLocaleId as 'en' | 'de' | 'en-US'),
        value: semester
      });
      if(currentSeason === Season.SUMMER) {
        currentYear -= 1;
      }
    }
  }

  writeValue(val: ISemester|undefined): void {
    if(val) {
      this.currentValue = this.semesterOptions.find(option => option.value.year === val?.year && option.value.season === val.season)?.value;
      if(!this.currentValue) {
        this.semesterOptions.push({
          title: getFullSemesterName(val, this.currentLocaleId as 'en' | 'de' | 'en-US'),
          value: val
        })
        this.currentValue = val;
      }
    }else {
      this.currentValue = undefined;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  handleValueChange(): void{
    this.onChange(this.currentValue);
  }
}
