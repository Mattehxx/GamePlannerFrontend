import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  filtersVisible : boolean = false;
  isMobileMenuOpen : boolean = false;
  

  private headerVisibilitySubject = new BehaviorSubject<boolean>(true);
  isModalOpen: boolean = false;
  headerVisibility$ = this.headerVisibilitySubject.asObservable();

  updateHeaderVisibility(isVisible: boolean) {
    this.headerVisibilitySubject.next(isVisible);
  }
}