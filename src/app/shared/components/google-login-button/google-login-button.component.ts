declare var google: any;
import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../features/authentication/services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { IRoles } from '../../../core/constants/roles';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthResponse } from '../../../models/auth-response';
import { LoadingService } from '../../../services/loading.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-google-login-button',
  standalone: true,
  imports: [],
  templateUrl: './google-login-button.component.html',
  styleUrl: './google-login-button.component.css',
})
export class GoogleLoginButtonComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _alert: AlertService,
    private _loading: LoadingService,
    private _ngZone: NgZone
  ) {}

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: environment.GoogleClientId,
      callback: this.handleCredentialResponse.bind(this),
    });

    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: 'filled_blue',
      size: 'large',
      width: '100%',
    });

    google.accounts.id.prompt((notification: PromptMomentNotification) => {});
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // Clean up Google Sign-In
    google.accounts.id.cancel();
  }

  async handleCredentialResponse(response: CredentialResponse) {
    this._loading.show();
    this._auth
      .loginWithGoogle(response.credential)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: AuthResponse) => {
          this._ngZone.run(() => {
            this.navigateBasedOnRole(res.user.role);
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Login error:', error);
          this._loading.hide();
          this._ngZone.run(() => {
            this._alert.error(`Login failed: ${error.status}`);
          });
        },
        complete: () => {
          this._loading.hide();
        },
      });
  }

  private navigateBasedOnRole(role: string = IRoles.Role_Customer) {
    this._ngZone.run(() => {
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
    });
  }
}
