import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function asDate(val: Date | string | null | undefined): Date | null | undefined {
  if(val === null) return null;
  else if(!val) return undefined;
  return new Date(val);
}

export function minDateValidator(minDate: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => control.value !== null && control.value > minDate ? {minDate: control.value} : null;
}

export function dateSequenceValidator(precedingDateControlName: string, succeedingDateControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => control.get(precedingDateControlName)?.value && control.get(succeedingDateControlName)?.value && control.get(precedingDateControlName)?.value > control.get(succeedingDateControlName)?.value ? {dateSequence: true} : null;
}
