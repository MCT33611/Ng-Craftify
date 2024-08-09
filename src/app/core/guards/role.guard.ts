import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { AlertService } from '../../services/alert.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService)
  const router = inject(Router)
  const alert  = inject(AlertService)

  if(tokenService.getUserRole() === route.data['role']){
    return true;
  }

  alert.error("Access Denied : you not "+route.data['role']);
  router.navigate(['/']); 
  return false;
};
