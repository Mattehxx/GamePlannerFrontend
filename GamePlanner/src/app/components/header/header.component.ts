import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { User } from '../../models/user.model';

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
    UserId: "1",
    Name: "Alice",
    Surname: "Smith",
    Email: "alice.smith@example.com",
    Phone: "123-456-7890",
    BirthDate: new Date("1990-05-15"),
    ImgUrl: undefined, // Puoi sostituirlo con un'immagine fittizia
    CanBeMaster: true,
    KnowledgeId: 1,
    Knowledge: { KnowledgeId: 1, Name: "D&D" }
  }
  
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
