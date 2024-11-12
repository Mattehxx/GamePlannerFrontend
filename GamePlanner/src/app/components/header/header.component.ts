import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/user.model';
import { HeaderService } from '../../services/header.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  
  constructor(private headerService: HeaderService){}
  
  @ViewChild('modal') modalElement!: ElementRef;
  @ViewChild('overlay') overlayElement!: ElementRef;
  
  isModalOpen: boolean = false;
  user : User = 
  {
    userId: "1",
    name: "Alice",
    surname: "Smith",
    email: "alice.smith@example.com",
    phone: "123-456-7890",
    birthDate: new Date("1990-05-15"),
    imgUrl: undefined, // Puoi sostituirlo con un'immagine fittizia
    canBeMaster: true,
    level: 1
  }

  isLogged : boolean = false;


  ngOnInit() {
    this.headerService.headerVisibility$.subscribe(isVisible => {
      const header = document.querySelector('.header-container') as HTMLElement;
      if (header) {
        header.style.transform = isVisible ? 'translate(-50%, 0)' : 'translate(-50%, -100%)';
      }
    });

  }
  
  toggleModal() {
    this.isModalOpen = !this.isModalOpen
  }
  
  closeModal() {
    this.isModalOpen = false;
  }
  
    @HostListener('document:click', ['$event'])
    handleClickOutside(event: MouseEvent) {
      // Verifica se il clic è fuori dalla modale o dall'overlay
      if (this.isModalOpen && !this.modalElement.nativeElement.contains(event.target) && !this.overlayElement.nativeElement.contains(event.target)) {
        this.closeModal();
      }
    }
}
