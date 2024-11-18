import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../environment/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {
  }

  isAdmin: boolean = true;
  isLogged: boolean = false;
  user: User | undefined;

  register(user: User): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register`, user);
  }

  login(request: any) {
    return this.http.post<any>(`${environment.apiUrl}/login`, request).subscribe({
      next: (response) => {
        this.setToken(response.token);
        this.setRefreshToken(response.refreshToken);
        this.setUserId(response.userId);
        this.isLogged = true;
        this.router.navigate(['/home'])
        this.getUser(response.userId);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
  getUser(id: string) {
    return this.http.get<User[]>(`${environment.apiUrl}/ApplicationUser?$filter=id eq '${id}'`).subscribe({
      next: (response) => {
        this.user = response[0];
        console.log(this.user)
        this.isLogged = true
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  }

  setUserId(id: string): void {
    localStorage.setItem('userId', id);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  logout(): void {
    localStorage.clear();
    this.isLogged = false;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<any>(`${environment.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }
}
