import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const isUserLogged = authService.verifyIfIsLoggedIn();

  const router = inject(Router);

  if (isUserLogged) {
    router.navigate(['profile']);
    return false;
  }

  return true;
};
