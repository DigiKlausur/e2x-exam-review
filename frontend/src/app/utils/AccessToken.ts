export function hasRole(token: any, role: string): boolean {
  return token.realm_access?.roles.includes(role);
}
