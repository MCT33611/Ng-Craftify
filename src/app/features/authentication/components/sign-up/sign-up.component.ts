import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { IRegistration } from '../../../../models/iregistration';
import { matchPasswords } from '../../../../shared/utils/matchPasswordsValidator';
import { noNumbersOrSpecialCharacters } from '../../../../shared/utils/noNumbersOrSpecialCharacters';
import { passwordStrengthValidator } from '../../../../shared/utils/passwordStrengthValidator';
import { AlertService } from '../../../../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { LoadingService } from '../../../../services/loading.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnDestroy {
  registrationForm!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    private _alert: AlertService,
    private _router: Router,
    private _loading: LoadingService
  ) {
    this.initForm();
    _loading.hide();
  }

  private initForm(): void {
    this.registrationForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, noNumbersOrSpecialCharacters]],
      lastName: ['', [Validators.required, noNumbersOrSpecialCharacters]],
      password: ['', [Validators.required, passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: matchPasswords
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this._loading.show()
      const user: IRegistration = {
        email: this.registrationForm.value.email,
        firstName: this.registrationForm.value.firstName,
        lastName: this.registrationForm.value.lastName,
        Password: this.registrationForm.value.password,
      };

      this._auth.register(user).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        complete: () => {
          this._router.navigate([`/auth/otp/${user.email}`]);
        },
        error: (error: HttpErrorResponse) => {
          this._loading.hide();
          this._alert.error(`${error.status}: ${error.error.title}`);
        }
      });
    } else {
      this._alert.warning('Form is not valid');
    }
  }

  ngOnDestroy(): void {
    this._loading.hide()
    this.destroy$.next();
    this.destroy$.complete();
  }
}