declare var google: any;
import { Component, NgZone, OnInit } from '@angular/core';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../features/authentication/services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { IRoles } from '../../../core/constants/roles';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthResponse } from '../../../models/auth-response';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-google-login-button',
  standalone: true,
  imports: [],
  templateUrl: './google-login-button.component.html',
  styleUrl: './google-login-button.component.css'
})
export class GoogleLoginButtonComponent implements OnInit {
  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _alert: AlertService,
    private _loading: LoadingService
  ) {

  }
  ngOnInit(): void {

    google.accounts.id.initialize({
      client_id: environment.GoogleClientId,
      callback: this.handleCredentialResponse.bind(this)

    });
    google.accounts.id.renderButton(
      document.getElementById("google-btn"),
      { theme: "filled_blue", size: "large", width: "100%" }
    );

    google.accounts.id.prompt((notification: PromptMomentNotification) => { });
  }
  async handleCredentialResponse(response: CredentialResponse) {
    this._loading.show();
    this._auth.loginWithGoogle(response.credential).subscribe(
      {
        next: (res:AuthResponse) => {
          this.navigateBasedOnRole(res.user.role);
        },

        error: (error: HttpErrorResponse) => {
          console.log(error);
          this._loading.hide();
          this._alert.error(`${error.status}`)
        }
      }
    );
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
}
