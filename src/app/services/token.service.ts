import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JwtPayload } from '../models/jwt-payload';
import { Observable, throwError } from 'rxjs';
import { AuthResponse } from '../models/auth-response';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly _AUTH_TOKEN_KEY = 'auth_token';
  private readonly _PASSWORD_RESET_TOKEN_KEY = 'password_reset_token';
  private readonly _REFRESH_TOKEN_KEY = 'refresh_token';

  private readonly _REMEMBER_ME_KEY = 'remember_me';

  constructor(private _jwtHelper: JwtHelperService, private _http: HttpClient) { }

  setToken(token: string): void {
    if (this.getRememberMe()) {
      localStorage.setItem(this._AUTH_TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(this._AUTH_TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (this.getRememberMe())
      return localStorage.getItem(this._AUTH_TOKEN_KEY);
    else
      return sessionStorage.getItem(this._AUTH_TOKEN_KEY);
  }

  removeToken(): void {
    if (this.getRememberMe())
      localStorage.removeItem(this._AUTH_TOKEN_KEY);
    else
      sessionStorage.removeItem(this._AUTH_TOKEN_KEY);
  }


  setRememberMe(value: 'true' | 'false'): void {
    localStorage.setItem(this._REMEMBER_ME_KEY, value);
  }

  getRememberMe(): boolean {
    return localStorage.getItem(this._REMEMBER_ME_KEY) === 'true';
  }

  clearRememberMe(): void {
    localStorage.removeItem(this._REMEMBER_ME_KEY);
  }


  // setRefreshToken(token: string): void {
  //   localStorage.setItem(this._REFRESH_TOKEN_KEY, token);
  // }
  // removeRefreshToken(): void {
  //   localStorage.removeItem(this._REFRESH_TOKEN_KEY);
  // }
  // getRefreshToken(): string | null {
  //   return localStorage.getItem(this._REFRESH_TOKEN_KEY);
  // }

  setRefreshToken(token: string): void {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // Set expiry to 30 days from now
    document.cookie = `${this._REFRESH_TOKEN_KEY}=${token}; expires=${expiryDate.toUTCString()}; path=/; Secure; SameSite=Strict`;
  }

  removeRefreshToken(): void {
    document.cookie = `${this._REFRESH_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict`;
  }

  getRefreshToken(): string | null {
    const name = this._REFRESH_TOKEN_KEY + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) == ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) == 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  getUserInfo(): JwtPayload | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    let info = this._jwtHelper.decodeToken(token);
    return {
      ...info,
      role: info['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    }
  }

  getUserId(): string | null {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.sub : null;
  }

  getWorkerId(): string | null | undefined {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.WorkerId : null;
  }

  getUserEmail(): string | null {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.email : null;
  }
  getUserRole(): string | null {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.role : null;
  }


  setPasswordResetToken(token: string): void {
    sessionStorage.setItem(this._PASSWORD_RESET_TOKEN_KEY, token);
  }



  getPasswordResetToken(): string | null {
    return sessionStorage.getItem(this._PASSWORD_RESET_TOKEN_KEY);
  }

  removePasswordResetToken(): void {
    sessionStorage.removeItem(this._PASSWORD_RESET_TOKEN_KEY);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getToken();
    const email = this.getUserEmail();

    if (!refreshToken || !email) {
      console.log("No refresh token or email available");
      return throwError(() => new Error('No refresh token or email available'));
    }

    return this._http.post<AuthResponse>(
      `${environment.API_BASE_URL}/api/Authentication/refresh`,
      { email, accessToken, refreshToken }
    );
  }
}
