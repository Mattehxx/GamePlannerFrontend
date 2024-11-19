import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,private router: Router) { }

  isAdmin : boolean = true;
  isLogged: boolean = true;


  register(user: User): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register`, user);
  }

  login(request: any) {
    return this.http.post<any>(`${environment.apiUrl}/login`, request).subscribe({
      next: (response) => {
        this.setToken(response.token);
        this.setRefreshToken(response.refreshToken);
        this.isLogged = true;
        this.router.navigate(['/home'])
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  getUser() {
    if (localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user')!);
    }
    else {
      return null;
    }
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
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
    // const token = this.getToken()
    const token =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibHVjYWdhbGxhenppQGdtYWlsLmNvbSIsImp0aSI6ImVjYzQ5ODU0LWI2YTYtNDg4ZC1hOWNiLWMzZmVmNWE1M2JlNCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJBZG1pbiIsIk5vcm1hbCJdLCJleHAiOjE3MzE5MjE5MjIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCJ9.sinHAfrQP5qETRKVeMxTO6QjageeyA2wg6nMwM1-SyA";
    return token !== null;
  }

  refreshAccessToken(): Observable<any> {
    // const refreshToken = this.getRefreshToken();
    const refreshToken = "dYmW6BjtrmO2kZ8diNHpZW+KOsm5hYHBB+cF/vRycWtQVAkGowMvctWC8QM1lrQXfG8xEyZFKrI/PRDMPXq34g==";
    
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
