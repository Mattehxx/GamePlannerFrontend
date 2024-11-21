import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  filtersVisible : boolean = false;
  isMobileMenuOpen : boolean = false;
  windowWidth: number = window.innerWidth;
  

  private headerVisibilitySubject = new BehaviorSubject<boolean>(true);
  headerVisibility$ = this.headerVisibilitySubject.asObservable();
  isModalOpen: boolean = false;

  private headerTitleSubject = new BehaviorSubject<boolean>(false);
  headerTitle$ = this.headerTitleSubject.asObservable();

  private ScrollToHalfSubject = new BehaviorSubject<boolean>(false);
  ScrollToHalf$ = this.ScrollToHalfSubject.asObservable();

  updateScrollToHalf(isVisible: boolean){
    this.ScrollToHalfSubject.next(isVisible);
  }

  getScrollToHalf(): boolean {
    return this.ScrollToHalfSubject.value;
  }

  updateHeaderTitleVisiblity(isVisible: boolean){
    this.headerTitleSubject.next(isVisible);
  }

  getTitleVisibility(): boolean {
    return this.headerTitleSubject.value;
  }
  
  updateHeaderVisibility(isVisible: boolean) {
    this.headerVisibilitySubject.next(isVisible);
  }
}