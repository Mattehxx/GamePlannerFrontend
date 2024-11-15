import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  constructor(public headerService: HeaderService, public router: Router, private elementRef: ElementRef, public as: AuthService) { }

  @ViewChild('modalElement') modalElement!: ElementRef;
  @ViewChild('overlayElement') overlayElement!: ElementRef;

  user: User =
    {
      userId: "1",
      name: "Alice",
      surname: "Smith",
      email: "alice.smith@example.com",
      phone: "123-456-7890",
      birthDate: new Date("1990-05-15"),
      imgUrl: undefined, // Puoi sostituirlo con un'immagine fittizia
      canBeMaster: true,
      level: 1,
      isDeleted: false,
      role: 'User'
    }

  ngOnInit() {
    this.headerService.headerVisibility$.subscribe(isVisible => {
      const header = document.querySelector('.header-container') as HTMLElement;
      if (header) {
        header.style.transform = isVisible ? 'translate(-50%, 0)' : 'translate(-50%, -100%)';
      }
    });

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

  }
  logOut() {
    this.as.logout();
  }
}
