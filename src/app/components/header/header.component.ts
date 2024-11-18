import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  user: User | undefined
  constructor(public headerService: HeaderService, public router: Router, private elementRef: ElementRef, public as: AuthService) { }

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
        console.log(response);
        if(response){
          this.user = response;
          console.log(this.user)
        }
        
      }
    })
  }

  toggleModal() {
    this.headerService.isModalOpen = !this.headerService.isModalOpen
  }

  closeModal() {
    this.headerService.isModalOpen = false;
  }

  navigateAndClose() {
    this.router.navigate(['userSettings']);
    this.headerService.isModalOpen = false;
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
      }, 100);
    }

    if (this.headerService.isMobileMenuOpen) {

      setTimeout(() => {
        const clickedInsideHeader = this.elementRef.nativeElement.contains(event.target);

        const clickedInsideMobileMenu = this.elementRef.nativeElement.querySelector('.mobile-menu')?.contains(event.target);

        if (this.headerService.isMobileMenuOpen && !clickedInsideHeader && !clickedInsideMobileMenu) {

          this.headerService.isMobileMenuOpen = false;

        }
      }, 0);
    }

  }



}
