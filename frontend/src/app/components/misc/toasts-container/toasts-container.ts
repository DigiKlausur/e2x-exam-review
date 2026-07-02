import {Component, inject, Signal, TemplateRef} from '@angular/core';
import {ToastService} from '../../../services/toast-service/toast-service';
import {NgbToast} from '@ng-bootstrap/ng-bootstrap';
import {NgTemplateOutlet} from '@angular/common';
import {Toast} from '../../../models/Toast';

@Component({
  selector: 'app-toasts-container',
  imports: [
    NgbToast,
    NgTemplateOutlet
  ],
  templateUrl: './toasts-container.html',
  styleUrl: './toasts-container.scss',
})
export class ToastsContainer {
  readonly toastService = inject(ToastService);

  asSignal(strOrSignal: TemplateRef<any> | Signal<string> | string): Signal<string> | (() => string) {
    if(typeof strOrSignal === 'string') return () => strOrSignal;
    return strOrSignal as Signal<string>;
  }

  asTemplateRef(template: TemplateRef<any> | Signal<string> | string): TemplateRef<any> {
    return template as TemplateRef<any>;
  }

  isBodyTemplate(toast: Toast): boolean{
    return toast.body instanceof TemplateRef;
  }
}
