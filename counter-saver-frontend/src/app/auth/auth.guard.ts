import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(AuthService).isLoggedIn();
  const router = inject(Router);

  if (isLoggedIn) {
    return true;
  }

  router.navigate(['login']);
  return false;
};
