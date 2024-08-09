import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../features/authentication/services/auth.service';
import { Router } from '@angular/router';
import { passwordStrengthValidator } from '../../utils/passwordStrengthValidator';
import { matchPasswords } from '../../utils/matchPasswordsValidator';
import { AlertService } from '../../../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-password-reset-form',
  standalone:true,
  imports:[
    ReactiveFormsModule,
  ],
  templateUrl: './password-reset-form.component.html',
  styleUrl: './password-reset-form.component.css'
})
export class PasswordResetFormComponent {
  @Input({required:true}) email!:string;
  @Input() redirectTo : string = '/auth/sign-in';
  resetForm!: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private _auth: AuthService,
    private _router: Router,
    private _alert: AlertService
  ){
    this.resetForm = this._fb.group({
      password: [
        '',
        [Validators.required, passwordStrengthValidator]
      ],
      confirmPassword: [
        '',
        [Validators.required]
      ]
    }, {
      validators: matchPasswords
    });
  }



  onPasswordSubmit(){
    if (this.resetForm.valid) {

      this._auth.resetPassword(this.email,this.resetForm.value.password).subscribe({
        complete:()=>{
          this._alert.success("password changed successfully")
          if(this.redirectTo)
            this._router.navigate([this.redirectTo]);
        },
        error:(error:HttpErrorResponse)=>{
          this._alert.error(`${error.status} : ${error.error.title}`)
          
        }
      });

    } else {
      this._alert.warning("cridentials are not valid")
    }
  }

}
