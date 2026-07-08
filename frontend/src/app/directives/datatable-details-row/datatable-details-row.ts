import {AfterViewInit, Directive, ElementRef, inject} from '@angular/core';

@Directive({
  selector: '[appDatatableDetailsRow]',
})
export class DatatableDetailsRow implements AfterViewInit{
  private elementRef: ElementRef = inject(ElementRef);

  constructor() {
  }

  ngAfterViewInit() {
    window.addEventListener('resize', () => this.updateColumnWidths());
    this.updateColumnWidths();
  }

  private updateColumnWidths(){
    const parentCells: HTMLCollectionOf<HTMLDivElement> = this.elementRef.nativeElement.parentElement.parentElement.querySelectorAll('datatable-body-row .datatable-body-cell');
    Array.from(this.elementRef.nativeElement.children as HTMLCollectionOf<HTMLDivElement>).forEach((element: HTMLDivElement, index: number) => {element.style.width = parentCells[index]?.offsetWidth ? parentCells[index].offsetWidth + 'px' : ''});
    console.log('updating', parentCells);
  }
}
