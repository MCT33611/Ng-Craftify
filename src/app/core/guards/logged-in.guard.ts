import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/authentication/services/auth.service';
import { inject } from '@angular/core';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    router.navigate(['/']); 
    return false;
  } else {
    return true;
  }
};
