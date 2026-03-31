import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appCustomInput]',
})
export class CustomInput {
  private hostElement: ElementRef = inject(ElementRef);

  get isInvalid(): boolean {
    return this.hostElement.nativeElement.classList.contains('is-invalid');
  }
}
