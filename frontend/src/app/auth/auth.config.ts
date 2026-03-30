import { PassedInitialConfig } from 'angular-auth-oidc-client';
import {environment} from '../../environments/environment';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: environment.openId.authorityUrl,
    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    clientId: environment.openId.clientId,
    scope: 'openid profile offline_access', // 'openid profile offline_access ' + your scopes
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    triggerRefreshWhenIdTokenExpired: true,
    renewTimeBeforeTokenExpiresInSeconds: 30,
    disablePkce: true, // disabled because of unwanted redirects
    secureRoutes: [
      environment.apiUrl
    ]
  },
};
