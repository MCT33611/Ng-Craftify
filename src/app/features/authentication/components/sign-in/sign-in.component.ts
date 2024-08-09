import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ILogin } from '../../../../models/ilogin';
import { AlertService } from '../../../../services/alert.service';
import { ProfileStore } from '../../../../shared/store/profile.store';
import { IRoles } from '../../../../core/constants/roles';
import { IUser } from '../../../../models/iuser';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { AuthResponse } from '../../../../models/auth-response';
import { TokenService } from '../../../../services/token.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnDestroy {
  loginForm: FormGroup;
  profileStore = inject(ProfileStore);
  private destroy$ = new Subject<void>();

  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    private _router: Router,
    private _alert: AlertService,
    private _token: TokenService
  ) {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const user: ILogin = this.loginForm.value;

      this._auth.login(user).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (res: AuthResponse) => {

          this.navigateBasedOnRole(res.user.role);
        },
        error: (err: HttpErrorResponse) => {
          this._alert.error(`${err.status}: Invalid credentials`);
        }
      });
    } else {
      this._alert.warning("Form is not valid");
    }
  }

  private navigateBasedOnRole(role: string = IRoles.Role_Customer) {
    switch (role) {
      case IRoles.Role_Admin:
        this._router.navigate(['/admin']);
        break;
      case IRoles.Role_Customer:
        this._router.navigate(['/customer']);
        break;
      case IRoles.Role_Worker:
        this._router.navigate(['/worker']);
        break;
      default:
        this._router.navigate(['/customer']);
    }
  }

  onRememberMeToggle(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this._token.setRememberMe(isChecked.toString() as 'true'|'false');
}
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}