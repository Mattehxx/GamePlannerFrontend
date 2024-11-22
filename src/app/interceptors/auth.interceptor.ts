import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError, BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUrl = this.router.url;

    if (request.url.includes('refresh') || currentUrl.startsWith('/confirm') || currentUrl.startsWith('/delete')) {
      return next.handle(request);
    }

    if(this.router.url.startsWith('/dashboard-admin') || this.authService.isLogged || request.url.includes('isAdmin')){
      const token = this.authService.getToken();

      if (token) {
        const payload = this.decodeTokenPayload(token);
        const isTokenExpired = this.isTokenExpired(payload?.exp);

        if (!isTokenExpired) {
          request = this.addTokenToRequest(request, token);
          return next.handle(request);
        } else {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshAccessToken().pipe(
              switchMap((newAuth: any) => {
                this.isRefreshing = false;
                this.refreshTokenSubject.next(newAuth.accessToken);
                const newRequest = this.addTokenToRequest(request, newAuth.accessToken);
                return next.handle(newRequest);
              }),
              catchError(error => {
                this.isRefreshing = false;
                this.authService.logout();
                return throwError(() => error);
              })
            );
          } else {
            return this.refreshTokenSubject.pipe(
              filter(token => token != null),
              take(1),
              switchMap(token => {
                const newRequest = this.addTokenToRequest(request, token);
                return next.handle(newRequest);
              })
            );
          }
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