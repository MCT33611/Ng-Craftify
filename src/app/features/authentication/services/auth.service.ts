import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRegistration } from '../../../models/iregistration';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ILogin } from '../../../models/ilogin';
import { TokenService } from '../../../services/token.service';
import { handleError } from '../../../shared/utils/handleError';
import { AuthResponse } from '../../../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(
    private _http: HttpClient,
    private _tokenService: TokenService
  ) { }

  register(user: IRegistration): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(`${environment.API_BASE_URL}/api/Authentication/register/`, user)
  }

  login(user: ILogin): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(`${environment.API_BASE_URL}/api/Authentication/login/`, user).pipe(
      tap((res: AuthResponse) => {
        this._tokenService.setToken(res.accessToken);
        this._tokenService.setRefreshToken(res.refreshToken);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }
  
  loginWithGoogle(credential: string): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(
      `${environment.API_BASE_URL}/api/Authentication/loginWithGoogle`,
      { idToken: credential }, 
      { headers: new HttpHeaders({'Content-Type': 'application/json'}) }
    ).pipe(
      tap((res: AuthResponse) => {
        this._tokenService.setToken(res.accessToken);
        this._tokenService.setRefreshToken(res.refreshToken);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  sentOtp(email: string): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(`${environment.API_BASE_URL}/api/Authentication/sendOtp/${encodeURIComponent(email)}`,null).pipe(
      catchError(handleError)
    )
  }

  confirmEmail(otp: string, email: string): Observable<boolean> {
    return this._http.put<boolean>(`${environment.API_BASE_URL}/api/Authentication/confirmEmail`, { otp, email }).pipe(
      catchError(handleError)
    );
  }

  forgetPassword(email: string): Observable<{passwordResetToken: string}> {
    return this._http.post<{passwordResetToken: string}>(`${environment.API_BASE_URL}/api/Authentication/forgotPassword/${email}`,null).pipe(
      tap((res: { passwordResetToken: string }) => {
        this._tokenService.setPasswordResetToken(res.passwordResetToken);
      }),
      catchError(error => {
        console.error(error);
        throw error;
      })
    );
  }

  resetPassword(email: string, password: string): Observable<Object> {
    const resetPasswordToken = this._tokenService.getPasswordResetToken();

    if (!resetPasswordToken) {
      return throwError(()=>new Error('Reset token not found'));
    }

    const body = {
      email: email,
      token: resetPasswordToken,
      newPassword: password
    };

    return this._http.put(
      `${environment.API_BASE_URL}/api/Authentication/resetPassword`,
      body
    ).pipe(
      tap(() => {
        this._tokenService.removePasswordResetToken();
      }),
      catchError(handleError)
    );
  }

  isLoggedIn(): boolean {
    const token = this._tokenService.getToken();
    return token !== null 
  }

  logout(): void {
    this._tokenService.removeToken();
    this._tokenService.removeRefreshToken();
    this._tokenService.clearRememberMe();
  }


}
