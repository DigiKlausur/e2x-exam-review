import {Injectable, signal} from '@angular/core';
import {Toast} from '../../models/Toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(toast: Toast): void {
    this._toasts.update((toasts) => [...toasts, toast]);
  }

  remove(toast: Toast) {
    this._toasts.update((toasts) => toasts.filter((t) => t !== toast));
  }
}
