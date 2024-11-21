import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { HeaderService } from '../../services/header.service';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  user: User | undefined
  constructor(public headerService: HeaderService, public router: Router, private elementRef: ElementRef, public as: AuthService,private gn: GeneralService) { }

  @ViewChild('modalElement') modalElement!: ElementRef;
  @ViewChild('overlayElement') overlayElement!: ElementRef;

  logOut() {
    this.as.logout();
    this.toggleModal();
  }
  ngOnInit() {
    this.headerService.headerVisibility$.subscribe(isVisible => {
      const header = document.querySelector('.header-container') as HTMLElement;
      if (header) {
        header.style.transform = isVisible ? 'translate(-50%, 0)' : 'translate(-50%, -100%)';
      }
    });

    this.as.user?.subscribe({
      next: (response) => {
        if(response){
          this.user = response;
          console.log(this.user);
        }
        
      }
    })
  }

  toggleModal() {
    this.headerService.isModalOpen = !this.headerService.isModalOpen;
    this.gn.isOverlayOn$.next(this.headerService.isModalOpen);
  }

  closeModal() {
    this.headerService.isModalOpen = false;
    this.gn.isOverlayOn$.next(false);
  }

  navigateAndClose() {
    this.headerService.isModalOpen = false;
    this.gn.isOverlayOn$.next(false);
    this.router.navigate(['userSettings']);
  }

  @HostListener('document:click', ['$event'])

  handleClickOutside(event: MouseEvent) {

    if (this.headerService.isModalOpen) {

      setTimeout(() => {
        const clickedInsideHeader = this.elementRef.nativeElement.contains(event.target);

        const clickedInsideModal = this.modalElement.nativeElement.contains(event.target);

        const clickedInsideOverlay = this.overlayElement.nativeElement.contains(event.target);

        if (this.headerService.isModalOpen && !clickedInsideHeader && !clickedInsideModal && !clickedInsideOverlay) {

          this.closeModal();

        }
      }, 0);
    }

    if (this.headerService.isMobileMenuOpen) {

      setTimeout(() => {
        const clickedInsideHeader = this.elementRef.nativeElement.contains(event.target);

        const clickedInsideMobileMenu = this.elementRef.nativeElement.querySelector('.mobile-menu')?.contains(event.target);

        if (this.headerService.isMobileMenuOpen && !clickedInsideHeader && !clickedInsideMobileMenu) {

          this.headerService.isMobileMenuOpen = false;
          this.gn.isOverlayOn$.next(false);

        }
      }, 0);
    }

  }

  mobileMenu(status: boolean) {
    if(status){
      this.headerService.isMobileMenuOpen = true;
      this.gn.isOverlayOn$.next(true);
    }
    else{
      this.headerService.isMobileMenuOpen = false;
      this.gn.isOverlayOn$.next(false);
    }
  }

  navigateUserSettings(){
    this.headerService.isMobileMenuOpen = false;
    this.headerService.isModalOpen = false;
    this.gn.isOverlayOn$.next(false);
    this.router.navigate(['userSettings']);
  }
  navigateDashboardAdmin() {
    this.headerService.isMobileMenuOpen = false;
    this.headerService.isModalOpen = false;
    this.gn.isOverlayOn$.next(false);
    this.router.navigate(['dashboard-admin/users']);
  }

  navigateLogin(status: boolean) {
    if(status){
      this.headerService.isMobileMenuOpen = false;
      this.gn.isOverlayOn$.next(false);
      this.router.navigate(['login']);
    }
    else{
      this.headerService.isMobileMenuOpen = false;
      this.gn.isOverlayOn$.next(false);
      this.router.navigate(['register']);
    }

  }
    
}
