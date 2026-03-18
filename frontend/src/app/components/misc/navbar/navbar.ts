import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {IStudent, IUser} from 'e2xgrader-exam-review-backend';
import {environment} from '../../../../environments/environment';
import {UserDisplayNamePipe} from '../../../pipes/user-display-name-pipe/user-display-name-pipe';

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

  ngOnInit(): void {
    this.oidcSecurityService.getUserData().subscribe((userData) => {
      this.authenticatedUser = {
        firstname: userData[environment.openId.mappings.firstname],
        lastname: userData[environment.openId.mappings.lastname],
        email: userData[environment.openId.mappings.email],
        studentId: userData[environment.openId.mappings.studentId] ?? undefined
      };
    })
  }

  handleLogout(): void{
    this.oidcSecurityService.logoff().subscribe((result) => console.log(result));
  }
}
