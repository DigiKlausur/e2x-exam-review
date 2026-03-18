import {Component, inject, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Navbar} from './components/misc/navbar/navbar';
import {ToastsContainer} from './components/misc/toasts-container/toasts-container';
import {LoginResponse, OidcSecurityService} from 'angular-auth-oidc-client';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, ToastsContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('e2xgrader-exam-review-frontend');
  private readonly oidcSecurityService = inject(OidcSecurityService);

  ngOnInit(): void {
    this.oidcSecurityService.checkAuth().subscribe((loginResponse: LoginResponse) => {
      const { isAuthenticated, userData, accessToken, idToken, configId } = loginResponse;
      console.log(isAuthenticated, userData, accessToken, idToken, configId);
      if(!isAuthenticated) this.oidcSecurityService.authorize();
    });
  }
}
