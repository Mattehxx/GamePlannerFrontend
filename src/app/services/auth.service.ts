import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Operation } from 'rfc6902';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router, private gn: GeneralService) {
  }

  isAdmin: boolean = true;
  isLogged: boolean = false;
  user: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);

  register(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}api/register`, user).subscribe({
        next: (res) => {
          resolve(res);
          this.gn.confirmMessage = 'User registered successfully';
          this.gn.setConfirm();
        },
        error: (error) => {
          // if (error.status === 400) {
          //   this.gn.errorMessage = 'User with this email already exists';
          //   this.gn.setError();
          // } else {
          //   console.error(error);
          //   this.gn.errorMessage = 'Server Error, please try again later';
          //   this.gn.setError();
          // }
          this.gn.errorMessage=error.error.message;
          this.gn.setError();
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
        this.loginIsAdmin();
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

  getUser(id: string) : Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.get<any>(`${environment.apiUrl}odata/ApplicationUser?$filter=Id eq '${id}'&$expand=Preferences($expand=Game&$expand=Knowledge),AdminEvents,Reservations`).subscribe({
        next: (response) => {
          if (response) {
            this.user.next(response.value[0]);
            this.isLogged = true;
            resolve(response.value[0]);
          } else {
            console.error('User not found');
            reject('User not found');
          }
        },
        error: (error) => {
          console.error(error);
          reject(error);
        }
      });
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
  getUserId(): string | null {
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
    this.router.navigate(['/home']);
    this.gn.confirmMessage = 'Logged out successfully';
    this.gn.setConfirm();
    this.gn.isLoadingScreen$.next(false);
    this.isAdmin = false;
  }

  isAuthenticated(): boolean {
    const token = this.getToken()
    return token !== null;
  }

  loginIsAdmin(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getToken();
    return new Promise((resolve, reject) => {
      if (!refreshToken) {
        reject(false);
        return;
      }
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`,
        'Refresh-Token': refreshToken
      });
      this.http.get<boolean>(`${environment.apiUrl}api/user/isAdmin`, { headers }).subscribe({
        next: (res) => {
          this.isAdmin = res;
          resolve(res);
        },error: (msg) => {
          if (msg.status === 401) {
            this.refreshAccessToken().subscribe({
              next: () => {
                this.loginIsAdmin().then(resolve).catch(reject);
              },
              error: (refreshError) => {
                console.error(refreshError);
                reject(false);
              }
            });
          } else {
            console.error(msg);
            reject(false);
          }
        }
      });
    })
    
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
          this.setToken(response.accessToken);
          this.setRefreshToken(response.refreshToken);
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }
  patchUser(userDetail: User, patch: Operation[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.patch<User>(`${environment.apiUrl}api/ApplicationUser/${userDetail.id}?$expand=Preferences`, patch).subscribe({
        next: (res) => {
          this.user.next(res);
          resolve(res);
          this.getUser(userDetail.id!);
        },
        error: (err) => {
          console.error(err);
          reject(err);
        }
      });
    });
  }
  //update image of user
  updateProfileImg(newImage : FormData){
    this.http.put<User>(`${environment.apiUrl}api/ApplicationUser/image/${localStorage.getItem('userId')}`,newImage).subscribe({
      next: (res)=> {
        const newUser = this.user.value;
        newUser!.imgUrl = res.imgUrl;
        this.user.next(newUser);
      },error: (msg)=> {
        console.error(msg);
        this.gn.errorMessage = 'failed to update profile image';
        this.gn.setError();
      }
    });
  }
}
