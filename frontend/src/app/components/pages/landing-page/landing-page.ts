import {Component, inject, OnInit} from '@angular/core';
import {AuthenticatedResult, OidcSecurityService} from 'angular-auth-oidc-client';
import {hasRole} from '../../../utils/AccessToken';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';
import {ReviewService} from '../../../services/review-service/review-service';
import {ManagementService} from '../../../services/management-service/management-service';

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
    this.oidcSecurityService.isAuthenticated$.subscribe((authenticatedResult: AuthenticatedResult) => {
      if (authenticatedResult.isAuthenticated) {
        this.oidcSecurityService.getPayloadFromAccessToken().subscribe(token => {
          if(hasRole(token, environment.openId.roleMappings.lecturer)) {
            return this.router.navigate(['/', 'manage']);
          } else if(hasRole(token, environment.openId.roleMappings.student)) {
            return this.router.navigate(['/', 'review']);
          }
          this.authFailed = true;
          return;
        });
      }
    })
  }
}
