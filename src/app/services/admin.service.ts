import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  isDeleteUserModal: boolean = false;
  isCreateUserModal : boolean = false;
  isGameDetail: boolean = false;

  private isOverlayVisible = new BehaviorSubject<boolean>(true);
  overlayVisible$ = this.isOverlayVisible.asObservable();

  constructor(private router: Router) {
    // Ascolta i cambi di route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setToFalse(); // Cambia il valore
      }
    });
  }

  setToFalse(): void {
    this.isOverlayVisible.next(false);
  }

  setToTrue(): void {
    this.isOverlayVisible.next(true);
  }



}
