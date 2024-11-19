import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  isDeleteUserModal: boolean = false;
  isCreateUserModal : boolean = false;

  showGameDetail: boolean = false;
  isDeleteGameModal: boolean = false;
  isCreateGameModal: boolean = false; 

 


}
