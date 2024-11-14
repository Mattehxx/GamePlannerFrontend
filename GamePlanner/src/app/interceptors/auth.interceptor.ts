import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('refresh')) {
      return next.handle(request);
    }

    if(this.router.url.startsWith('/dashboard-admin')){
      const token = this.authService.getToken();

    if (token) {
      const payload = this.decodeTokenPayload(token);
      const isTokenExpired = this.isTokenExpired(payload?.exp);

      if (!isTokenExpired) {
        request = this.addTokenToRequest(request, token);
        return next.handle(request);
      } else {
        return this.authService.refreshAccessToken().pipe(
          switchMap((newAuth: any) => {
            const newRequest = this.addTokenToRequest(request, newAuth.token);
            return next.handle(newRequest);
          }),
          catchError(error => {
            this.authService.logout();
            return throwError(() => error);
          })
        );
      }
    }
    return next.handle(request);
    }

    return next.handle(request);
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private decodeTokenPayload(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      return null;
    }
  }

  private isTokenExpired(exp: number): boolean {
    if (!exp) return true;
    const currentTime = Math.floor(Date.now() / 1000) + 30; //buffer per evitare problemi di timing
    return exp < currentTime;
  }
}