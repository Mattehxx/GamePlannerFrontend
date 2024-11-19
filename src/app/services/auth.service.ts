import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../environment/environment';
import { User } from '../models/user.model';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router,private gn: GeneralService) {
  }

  isAdmin: boolean = true;
  isLogged: boolean = false;
  user: BehaviorSubject<User> = new BehaviorSubject<User>({ name: '', surname: '', role: '' });

  register(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}api/register`, user).subscribe({
        next: (res) => {
          resolve(res);
          this.gn.confirmMessage = 'User registered successfully';
          this.gn.setConfirm();
        },
        error: (error) => {
          if (error.status === 400) {
            this.gn.errorMessage = 'User with this email already exists';
            this.gn.setError();
          } else {
            console.error(error);
            this.gn.errorMessage = 'Server Error, please try again later';
            this.gn.setError();
          }
          reject(error);
        }
      });
    });
  }

  login(request: any) {
    return this.http.post<any>(`${environment.apiUrl}api/login`, request).subscribe({
      next: (response) => {
        this.setToken(response.token);
        this.setRefreshToken(response.refreshToken);
        this.setUserId(response.userId);
        this.isLogged = true;
        this.router.navigate(['/home'])
        this.getUser(response.userId);
      },
      error: (error) => {
        if (error.status === 401) {
          this.gn.errorMessage = 'Invalid email or password';
          this.gn.setError();
        } else {
          console.error(error);
          this.gn.errorMessage = 'Server Error, please try again later';
          this.gn.setError();
        }
      }
    })
  }

  getUser(id: string) {
    return this.http.get<any>(`${environment.apiUrl}odata/ApplicationUser?$filter=Id eq '${id}'&$expand=Preferences($expand=Game&$expand=Knowledge),AdminEvents,Reservations`).subscribe({
      next: (response) => {
        if (response) {
          this.user.next(response.value[0]);
          this.isLogged = true;
        } else {
          console.error('User not found');
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
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
  getUserId() : string | null {
    return localStorage.getItem('userId');
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
    this.router.navigate(['/login']);
    this.gn.confirmMessage = 'Logged out successfully';
    this.gn.setConfirm();
  }

  isAuthenticated(): boolean {
    // const token = this.getToken()
    const token =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibHVjYWdhbGxhenppQGdtYWlsLmNvbSIsImp0aSI6ImVjYzQ5ODU0LWI2YTYtNDg4ZC1hOWNiLWMzZmVmNWE1M2JlNCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJBZG1pbiIsIk5vcm1hbCJdLCJleHAiOjE3MzE5MjE5MjIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTAwMCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDIwMCJ9.sinHAfrQP5qETRKVeMxTO6QjageeyA2wg6nMwM1-SyA";
    return token !== null;
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<any>(`${environment.apiUrl}api/refresh`, { refreshToken })
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
