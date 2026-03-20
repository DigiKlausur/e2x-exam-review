import {Component, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Navbar} from './components/misc/navbar/navbar';
import {ToastsContainer} from './components/misc/toasts-container/toasts-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ToastsContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('e2xgrader-exam-review-frontend');
}
