import {Component, effect, inject, Signal, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Navbar} from './components/misc/navbar/navbar';
import {ToastsContainer} from './components/misc/toasts-container/toasts-container';
import {environment} from '../environments/environment';
import {ReviewService} from './services/review-service/review-service';
import {ManagementService} from './services/management-service/management-service';
import { Footer } from './components/misc/footer/footer';
import {KEYCLOAK_EVENT_SIGNAL, KeycloakEvent, KeycloakEventType} from 'keycloak-angular';
import {AuthService} from './services/auth-service/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ToastsContainer, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly reviewService: ReviewService = inject(ReviewService);
  private readonly managementService: ManagementService = inject(ManagementService);
  private readonly authService: AuthService = inject(AuthService);
  protected readonly title = signal('e2x-exam-review-frontend');
  private keycloakSignal: Signal<KeycloakEvent> = inject(KEYCLOAK_EVENT_SIGNAL);

  constructor() {
    effect(() => {
      const keycloakEvent = this.keycloakSignal();

      if(keycloakEvent.type === KeycloakEventType.Ready){
        if(this.authService.hasRole(environment.keycloak.roleMappings.lecturer)){
          this.managementService.updateUserData().subscribe(() => {});
        } else if (this.authService.hasRole(environment.keycloak.roleMappings.student)) {
          this.reviewService.updateStudentData().subscribe(() => {});
        }
      }
    });
  }
}
