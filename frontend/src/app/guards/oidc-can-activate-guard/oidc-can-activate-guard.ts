import {CanActivateFn, Router} from '@angular/router';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {inject} from '@angular/core';
import {map, take} from 'rxjs';
import {hasRole} from '../../utils/AccessToken';


export const oidcCanActivateGuard: CanActivateFn = (route, state) => {
  const oidcSecurityService: OidcSecurityService = inject(OidcSecurityService);
  const router: Router = inject(Router);

  return oidcSecurityService.getPayloadFromAccessToken().pipe(
    take(1),
    map(token => {
      if(!route.data['roles']){
        return true;
      }else if(route.data['roles'].some((role: string) => hasRole(token, role))){
        return true;
      }
      router.navigate(['/']);
      return false;
    })
  );
};
