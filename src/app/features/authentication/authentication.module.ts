import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LayoutComponent } from './layout/layout.component';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleLoginButtonComponent } from '../../shared/components/google-login-button/google-login-button.component';
import { PasswordResetFormComponent } from '../../shared/components/password-reset-form/password-reset-form.component';
import { SharedModule } from '../../shared/shared.module';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { OtpComponent } from '../../shared/components/otp/otp.component';


@NgModule({
  declarations: [

    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    LayoutComponent
  ],
  imports: [    
    OtpComponent,
    CommonModule,
    AuthenticationRoutingModule,
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    GoogleLoginButtonComponent,
    PasswordResetFormComponent
  ]
})
export class AuthenticationModule { }
