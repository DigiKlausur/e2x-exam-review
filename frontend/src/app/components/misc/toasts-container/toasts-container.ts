import {Component, inject} from '@angular/core';
import {ToastService} from '../../../services/toast-service/toast-service';
import {NgbToast} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-toasts-container',
  imports: [
    NgbToast
  ],
  templateUrl: './toasts-container.html',
  styleUrl: './toasts-container.scss',
})
export class ToastsContainer {
  readonly toastService = inject(ToastService);
}
