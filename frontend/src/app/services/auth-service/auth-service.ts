import {effect, inject, Injectable, Signal} from '@angular/core';
import Keycloak from 'keycloak-js';
import {KEYCLOAK_EVENT_SIGNAL, KeycloakEvent, KeycloakEventType} from 'keycloak-angular';
import {environment} from '../../../environments/environment';
import {IStudent, IUser} from 'e2x-exam-review-backend';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private keycloak: Keycloak = inject(Keycloak);


  constructor() {

  }

  isLoggedIn(): boolean {
    return this.keycloak.authenticated
  }

  hasRole(role: string): boolean {
    return this.isLoggedIn() && this.keycloak.hasRealmRole(role);
  }

  getAccessToken(): string|undefined {
    return this.keycloak.token;
  }

  async logout(): Promise<void> {
    return this.keycloak.logout({
      redirectUri: window.origin
    });
  }

  async manageAccount(): Promise<void>{
    return this.keycloak.accountManagement();
  }

  async getAuthenticatedUser(): Promise<IUser | undefined> {
    if(!this.keycloak.authenticated) return undefined;
    return this.keycloak.loadUserProfile().then(userProfile => ({
      _id: '',
      firstname: userProfile.firstName as string,
      lastname: userProfile.lastName as string,
      email: userProfile.email as string,
      uniqueId: userProfile.username as string
    }));
  }
}
