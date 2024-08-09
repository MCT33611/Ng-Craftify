import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpRequest, HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { TokenService } from '../../services/token.service';
import { AuthResponse } from '../../models/auth-response';
import { AuthService } from '../../features/authentication/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    private tokenService: TokenService,
    private _authService: AuthService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.tokenService.getToken();
  
    if (token) {
      request = this.addToken(request, token);
    }
  
    return next.handle(request).pipe(
      catchError(error => {
        console.log('Interceptor caught an error:', error);
        if (error instanceof HttpErrorResponse && error.status === 401) {
          console.log('401 error detected, attempting to refresh token');
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }
  
  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.tokenService.refreshToken().pipe(
      switchMap((res: AuthResponse) => {
        this.tokenService.setToken(res.accessToken);
        this.tokenService.setRefreshToken(res.refreshToken);
        return next.handle(this.addToken(request, res.accessToken));
      }),
      catchError(err => {
        this.tokenService.removeToken();
        this.tokenService.removeRefreshToken();
        this._authService.logout();
        return throwError(() => err);
      })
    );
  }

  private addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'accept': '*/*'
    });

    if (!(request.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    return request.clone({ headers });
  }
}