import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Operation } from 'rfc6902';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../environment/environment';
import { User, UserForm } from '../models/user.model';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router, private gn: GeneralService) {
  }

  isAdmin: boolean = true;
  isLogged: boolean = false;
  user: BehaviorSubject<User> = new BehaviorSubject<User>({ name: '', surname: '', role: '', id: '' });

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
        console.log(response);
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
    console.log("setting " + refreshToken)
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
    this.router.navigate(['/login']);
    this.gn.confirmMessage = 'Logged out successfully';
    this.gn.setConfirm();
    this.gn.isLoadingScreen$.next(false);
  }

  isAuthenticated(): boolean {
    const token = this.getToken()
    return token !== null;
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<any>(`${environment.apiUrl}api/refresh-token`, { accessToken, refreshToken })
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
  patchUser(userDetail: UserForm, patch: Operation[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.patch<User>(`${environment.apiUrl}api/ApplicationUser/${userDetail.id}`, patch).subscribe({
        next: (res) => {
          this.user.next(res);
          resolve(res);
          console.log(res);
        },
        error: (err) => {
          console.error(err);
          reject(err);
        }
      });
    });
  }
}
