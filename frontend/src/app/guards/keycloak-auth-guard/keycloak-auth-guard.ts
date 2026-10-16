import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthGuardData, createAuthGuard} from 'keycloak-angular';
import {inject} from '@angular/core';
import Keycloak from "keycloak-js";

const keycloakCanActivateAuthGuard = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot, authData: AuthGuardData): Promise<boolean | UrlTree> => {
  const { authenticated, grantedRoles } = authData;

  if (!authenticated) {
    const keycloak = inject(Keycloak);
    await keycloak.login({
      redirectUri: window.location.origin + state.url,
    });
  }

  const requiredRoles: string[] | undefined = route.data['roles'];
  if (!requiredRoles || requiredRoles.length === 0) {
    return authenticated;
  }

  return requiredRoles.some((role) => grantedRoles.realmRoles.includes(role)); // only one of the roles is required
};

export const keycloakAuthGuard = createAuthGuard<CanActivateFn>(keycloakCanActivateAuthGuard);
