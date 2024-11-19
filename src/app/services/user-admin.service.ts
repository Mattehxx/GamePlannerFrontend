import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from '../environment/environment';
import { BehaviorSubject } from 'rxjs';
import { GameModel } from '../models/game.model';
import { Operation } from 'rfc6902';

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {

  User$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  UserDetail: User | undefined;
  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<any>(`${environment.apiUrl}api/ApplicationUser/GetAll`).subscribe({
      next: (res) => {
        this.User$.next(res);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  getUserDetails(id: string){
    
  }

  createAdminUser(user: any) {
    return this.http.post<any>(`${environment.apiUrl}api/register-admin`, user);
  }

  deleteUser(id: string){

  }

  changeUserStatus(user: User,patch: Operation){

  }
}
