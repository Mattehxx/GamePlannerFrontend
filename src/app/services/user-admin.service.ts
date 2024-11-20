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

  getUsers() : Promise<any>{
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${environment.apiUrl}api/ApplicationUser/GetAll`).subscribe({
        next: (res) => {
          const sortedUsers = res.sort((a: User, b: User) => {
            return Number(a.isDisabled) - Number(b.isDisabled);
          });
    
          this.User$.next(sortedUsers);
          resolve(res);
        },
        error: (err) => {
          console.error(err);
          reject(err);
        }
      });
    });
  }

  getUserDetails(id: string){
    
  }

  createAdminUser(user: any) {
    return this.http.post<any>(`${environment.apiUrl}api/register-admin`, user);
  }

  deleteUser(id: string): Promise<void>{

    return new Promise((resolve, reject) => {
      
      this.http.delete(`${environment.apiUrl}api/ApplicationUser/${id}`).subscribe({
        next: () => {
          const users = this.User$.value;
          this.User$.next(users.filter((user) => user.id !== id));
          resolve();
        },
        error: (err) => {
          reject(err);
        },
      })
    })
   }

  changeUserStatus(user: User,patch: Operation[]): Promise<void>{

    return new Promise((resolve, reject) => {
      
      this.http.patch(`${environment.apiUrl}api/ApplicationUser/${user.id}`, patch).subscribe({
        next: () => {
          const users = this.User$.value;
          const index = users.findIndex(user => user.id === user.id);
          if (index !== -1) {
            users[index] = user;
            this.User$.next(users);
          }
          resolve();
        },
        error: (err) => {
          console.error(err);
          reject(err);
        }
      })
    })
  }
}
