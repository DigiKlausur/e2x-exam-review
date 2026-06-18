import {environment} from '../../environments/environment';

export function hasRole(token: any, role: string): boolean {
  return token.realm_access?.[environment.openId.attributeMappings.roles].includes(role);
}
