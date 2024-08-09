import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/authentication/services/auth.service';
import { inject } from '@angular/core';
import { ProfileService } from '../../features/profile/services/profile.service';
import { IUser } from '../../models/iuser';
import { AlertService } from '../../services/alert.service';
import { handleError } from '../../shared/utils/handleError';
import { lastValueFrom } from 'rxjs';
import { TokenService } from '../../services/token.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const profileService = inject(ProfileService)
  const router = inject(Router);
  const alertService = inject(AlertService)
  const tokenService = inject(TokenService)


  if (authService.isLoggedIn()) {
    try {
      const res: IUser | undefined = await lastValueFrom(profileService.get());
      if (res) {
        if (!res.emailConfirmed) {
          router.navigate([`/auth/otp/${res.email}`]);
          return false;
        }
        if (res.blocked) {
          alertService.warning("Your account is blocked by admin for some reasons");
          router.navigate(['/auth/sign-in'], { queryParams: { returnUrl: state.url } });
          return false;
        }
        return true;
      }
      else {
        alertService.error("user not font or server error, try after some time");
        router.navigate(['/auth/sign-in'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    } catch (error:any) {
      handleError(error)
      return false;
    }
  } else {
    router.navigate(['/auth/sign-in'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};