import {ChangeDetectorRef, Component, effect, inject, Signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {IStudent, IUser} from 'e2x-exam-review-backend';
import {environment} from '../../../../environments/environment';
import {UserDisplayNamePipe} from '../../../pipes/user-display-name-pipe/user-display-name-pipe';
import {AuthService} from '../../../services/auth-service/auth-service';
import {KEYCLOAK_EVENT_SIGNAL, KeycloakEvent, KeycloakEventType} from 'keycloak-angular';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    UserDisplayNamePipe
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar{
  private readonly authService: AuthService = inject(AuthService);
  private keycloakSignal: Signal<KeycloakEvent> = inject(KEYCLOAK_EVENT_SIGNAL);
  private changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);

  protected authenticatedUser?: IUser | IStudent;
  protected isLecturer: boolean = false;
  protected isStudent: boolean = false;

  constructor() {
    effect(() => {
      const keycloakEvent = this.keycloakSignal();

      if(keycloakEvent.type === KeycloakEventType.Ready){
        if(this.authService.hasRole(environment.keycloak.roleMappings.lecturer)){
          this.isLecturer = true;
        } else if (this.authService.hasRole(environment.keycloak.roleMappings.student)) {
          this.isStudent = true;
        }
      }

      this.authService.getAuthenticatedUser().then(userProfile => {
        this.authenticatedUser = userProfile;
        this.changeDetector.detectChanges();
      })
    });
  }

  async handleManageAccount(): Promise<void>{
    return this.authService.manageAccount();
  }

  async handleLogout(): Promise<void>{
    await this.authService.logout();
  }
}
