import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthenticatedResult, OidcSecurityService} from 'angular-auth-oidc-client';
import {IStudent, IUser} from 'e2x-exam-review-backend';
import {environment} from '../../../../environments/environment';
import {UserDisplayNamePipe} from '../../../pipes/user-display-name-pipe/user-display-name-pipe';
import {hasRole} from '../../../utils/AccessToken';

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
export class Navbar implements OnInit {
  private readonly oidcSecurityService: OidcSecurityService = inject(OidcSecurityService);

  protected authenticatedUser?: IUser | IStudent;
  protected isLecturer: boolean = false;
  protected isStudent: boolean = false;

  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe((authenticationResult: AuthenticatedResult) => {
      if (authenticationResult.isAuthenticated) {
        this.oidcSecurityService.getPayloadFromAccessToken().subscribe((token) => {
          this.authenticatedUser = {
            firstname: token[environment.openId.attributeMappings.firstname],
            lastname: token[environment.openId.attributeMappings.lastname],
            email: token[environment.openId.attributeMappings.email],
            studentId: token[environment.openId.attributeMappings.studentId] ?? undefined
          };
          this.isLecturer = hasRole(token, environment.openId.roleMappings.lecturer);
          this.isStudent = hasRole(token, environment.openId.roleMappings.student);
        });
      }
    });
  }

  handleLogout(): void{
    this.oidcSecurityService.logoffAndRevokeTokens().subscribe((result) => console.log(result));
  }
}
