import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../../../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnDestroy {
  isEmailValid = false;
  forgotForm: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private _fb: FormBuilder,
    private _alert: AlertService,
    private _auth: AuthService,
  ) {
    this.forgotForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onEmailSubmit() {
    if (this.forgotForm.valid) {
      this._auth.forgetPassword(this.forgotForm.value.email).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        complete: () => {
          this.isEmailValid = true;
          this._alert.success('Password reset email sent successfully');
        },
        error: (error: HttpErrorResponse) => 
          this._alert.error(`${error.status}: ${error.error.title || 'An error occurred'}`)
      });
    } else {
      this._alert.error("Credentials are not valid");
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}