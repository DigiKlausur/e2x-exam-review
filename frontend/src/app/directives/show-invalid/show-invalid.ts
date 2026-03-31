import { Directive, HostBinding, inject } from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appShowInvalid]',
})
export class ShowInvalid {
  private formControl: NgControl = inject(NgControl);

  @HostBinding('class.is-invalid')
  get isInvalid(): boolean {
    return (
      (this.formControl.invalid ?? false) &&
      ((this.formControl.dirty ?? false) || (this.formControl.touched ?? false))
    );
  }

  get errors(): ValidationErrors | null {
    return this.formControl.errors;
  }

  hasError(error: string): boolean {
    if (!this.isInvalid) return false;
    return this.formControl.hasError(error);
  }
}
