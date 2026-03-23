import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Navbar} from './components/misc/navbar/navbar';
import {ToastsContainer} from './components/misc/toasts-container/toasts-container';
import {LoginResponse, OidcSecurityService} from 'angular-auth-oidc-client';
import {hasRole} from './utils/AccessToken';
import {environment} from '../environments/environment';
import {ReviewService} from './services/review-service/review-service';
import {ManagementService} from './services/management-service/management-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ToastsContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly oidcSecurityService: OidcSecurityService = inject(OidcSecurityService);
  private readonly reviewService: ReviewService = inject(ReviewService);
  private readonly managementService: ManagementService = inject(ManagementService);
  protected readonly title = signal('e2xgrader-exam-review-frontend');

  ngOnInit(): void {
    this.oidcSecurityService.checkAuth().subscribe((loginResponse: LoginResponse) => {
      if (loginResponse.isAuthenticated) {
        this.oidcSecurityService.getPayloadFromAccessToken().subscribe(token => {
          if(hasRole(token, environment.openId.roleMappings.lecturer)) {
            return this.managementService.updateUserData().subscribe(() => {
            });
          } else if(hasRole(token, environment.openId.roleMappings.student)) {
            return this.reviewService.updateStudentData().subscribe(() => {
            });
          }
          return;
        });
      } else {
        this.login();
      }
    })
  }

  login(): void {
    this.oidcSecurityService.authorize();
  }
}
