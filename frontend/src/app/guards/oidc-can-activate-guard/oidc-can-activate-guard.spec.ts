import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import oidcCanActivateGuard from './oidc-can-activate-guard';

describe('oidcCanActivateGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => oidcCanActivateGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
