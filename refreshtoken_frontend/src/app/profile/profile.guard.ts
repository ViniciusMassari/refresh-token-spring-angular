import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';

export const canActivateProfile: CanActivateFn = () => {
  const authService = inject(AuthService);
  const isUserLogged = authService.verifyIfIsLoggedIn();

  const router = inject(Router);

  if (isUserLogged) {
    return true;
  }

  router.navigate(['login']);
  return false;
};
