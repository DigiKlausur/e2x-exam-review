import { PassedInitialConfig } from 'angular-auth-oidc-client';
import {environment} from '../../environments/environment';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: environment.openId.authorityUrl,
    redirectUrl: window.location.origin + window.location.pathname,
    //checkRedirectUrlWhenCheckingIfIsCallback: false, //todo: check if this is necessary
    postLogoutRedirectUri: window.location.origin,
    clientId: environment.openId.clientId,
    scope: environment.openId.scopes?.join(' '),
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    triggerRefreshWhenIdTokenExpired: true,
    renewTimeBeforeTokenExpiresInSeconds: 30,
    disablePkce: false, // disabled because of unwanted redirects
    secureRoutes: [
      environment.apiUrl
    ]
  },
};
