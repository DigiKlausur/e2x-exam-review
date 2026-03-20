import {Component, inject, OnInit} from '@angular/core';
import {LoginResponse, OidcSecurityService} from 'angular-auth-oidc-client';
import {hasRole} from '../../../utils/AccessToken';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
  imports: [
    NgbAlert
  ]
})
export class LandingPage implements OnInit {
  private readonly oidcSecurityService: OidcSecurityService = inject(OidcSecurityService);
  private readonly router: Router = inject(Router);

  protected authFailed: boolean = false;

  ngOnInit(): void {
    this.oidcSecurityService.checkAuth().subscribe((loginResponse: LoginResponse) => {
      if (loginResponse.isAuthenticated) {
        this.oidcSecurityService.getPayloadFromAccessToken().subscribe(token => {
          if(hasRole(token, environment.openId.roleMappings.lecturer)) {
            return this.router.navigate(['/', 'manage']);
          } else if(hasRole(token, environment.openId.roleMappings.student)) {
            return this.router.navigate(['/', 'review']);
          }
          this.authFailed = true;
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
