import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventModel } from '../../models/event.model';
import { gameSessionModel } from '../../models/gameSession.model';
import { User } from '../../models/user.model';
import { DurationPipe } from "../../pipes/duration.pipe";
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, DurationPipe],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {

  constructor(public headerService: HeaderService){}

  isEmpty: boolean = false;
  @Input() isScrolled = false;
  selectedFrequency: string = '';
  selectedGame: string = '';
  duration: number = 0;
  eventsCount: number = 10; //numero di eventi che prendo con chiamata odata
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 0;
  activeFilters: Array<string> = [];

  admin: User = {
    userId: 'sfasf',
    name: 'Yassine',
    surname: 'admin',
    email: '',
    phone: '',
    birthDate: new Date('1995-01-01'),
    imgUrl: '',
    canBeMaster: true,
    level: 1
  }

  gameSession: gameSessionModel = {
    gameSessionId: 1,
    gameSessionDate: new Date('2023-11-01'),
    gameSessionEndDate: new Date('2023-11-02'),
    isDeleted: false,
    masterId: 301,
    eventId: 1,
    tableId: 401,
    master: this.admin,
    table: {
      tableId: 401,
      name: 'Table 1',
      seats: 4,
      isDeleted: false
    }
  }

  arrayEvent: EventModel[] = [
    {
      eventId: 1,
      name: 'Event 1',
      description: 'Description for Event 1',
      eventDate: new Date('2023-11-01'),
      eventEndDate: new Date('2023-11-02'),
      duration: 0.5,
      isPublic: true,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: false,
      recurrenceId: 1,
      gameId: 101,
      adminId: 201,
      admin: this.admin,
      gameSessions: [this.gameSession]
    },
    {
      eventId: 2,
      name: 'Event 2',
      description: 'Description for Event 2',
      eventDate: new Date('2023-12-01'),
      eventEndDate: new Date('2023-12-02'),
      duration: 2,
      isPublic: false,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: false,
      recurrenceId: 2,
      gameId: 102,
      adminId: 202,
      admin: this.admin,
      gameSessions: [this.gameSession]
    },
    {
      eventId: 3,
      name: 'Event 3',
      description: 'Description for Event 3',
      eventDate: new Date('2024-01-01'),
      eventEndDate: new Date('2024-01-02'),
      duration: 3,
      isPublic: true,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: false,
      recurrenceId: 3,
      gameId: 103,
      adminId: 203,
      gameSessions: [this.gameSession]
    },
    {
      eventId: 4,
      name: 'Event 4',
      description: 'Description for Event 4',
      eventDate: new Date('2024-02-01'),
      eventEndDate: new Date('2024-02-02'),
      duration: 1,
      isPublic: false,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: false,
      recurrenceId: 4,
      gameId: 104,
      adminId: 204,
      gameSessions: [this.gameSession]
    },
    {
      eventId: 4,
      name: 'Event 4',
      description: 'Description for Event 4',
      eventDate: new Date('2024-02-01'),
      eventEndDate: new Date('2024-02-02'),
      duration: 1,
      isPublic: false,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: false,
      recurrenceId: 4,
      gameId: 104,
      adminId: 204,
      gameSessions: [this.gameSession]
    },
    {
      eventId: 4,
      name: 'Event 4',
      description: 'Description for Event 4',
      eventDate: new Date('2024-02-01'),
      eventEndDate: new Date('2024-02-02'),
      duration: 1,
      isPublic: false,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: false,
      recurrenceId: 4,
      gameId: 104,
      adminId: 204
    },
    {
      eventId: 4,
      name: 'Event 4',
      description: 'Description for Event 4',
      eventDate: new Date('2024-02-01'),
      eventEndDate: new Date('2024-02-02'),
      duration: 1,
      isPublic: false,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: false,
      recurrenceId: 4,
      gameId: 104,
      adminId: 204
    }
  ];

  filteredEvents: EventModel[] = [...this.arrayEvent];
  paginatedEvents: EventModel[] = [];

  userInput: string = '';

  
  ngOnInit() {
    this.filteredEvents = [...this.arrayEvent];
    this.totalPages = Math.ceil(this.filteredEvents.length / this.itemsPerPage);
    this.updatePaginatedEvents();
  }

  filterEvents() {
    this.filteredEvents = this.arrayEvent.filter(event =>
      event.name.toLowerCase().includes(this.userInput.toLowerCase())
    );
    this.isEmpty = this.filteredEvents.length === 0;
    this.totalPages = Math.ceil(this.filteredEvents.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedEvents();
  }

  toggleFilters() {
    this.headerService.filtersVisible = !this.headerService.filtersVisible;
  }

  @HostListener('document:click', ['$event'])
  closeFilters(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.headerService.filtersVisible && !target.closest('.filters-page') && !target.closest('.filters')) {
      this.headerService.filtersVisible = false;
    }
  }

  applyFilter() {
    //chiamata odata
    if(this.selectedFrequency !== ''){
      this.activeFilters.push(this.selectedFrequency);
    }

    if(this.selectedGame !== ''){
      this.activeFilters.push(this.selectedGame);
    }
    this.headerService.filtersVisible = false;
  }

  clearFilter(){
    this.selectedFrequency= '';
    this.selectedGame = '';
    this.activeFilters = [];
  }

  updateSliderValue(event: any) {
    const value = event.target.value;
    event.target.style.setProperty('--value', value);
  }

  removeFilter(filter: string) {
    this.activeFilters = this.activeFilters.filter(f => f !== filter);
    //nuova chiamata odata
  }

  updatePaginatedEvents() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEvents = this.filteredEvents.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedEvents();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedEvents();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedEvents();
    }
  }

}
