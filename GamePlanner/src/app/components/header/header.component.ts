import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterViewInit {
  
  
  @ViewChild('modal') modalElement!: ElementRef;
  @ViewChild('overlay') overlayElement!: ElementRef;
  
  isLogged: boolean = true;
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
    knowledgeId: 1,
    knowledge: { KnowledgeId: 1, Name: "D&D" }
  }


  constructor(public router : Router){}
  
  
  ngAfterViewInit(): void {
    
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
