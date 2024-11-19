import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventModel } from '../../models/event.model';
import { gameSessionModel } from '../../models/gameSession.model';
import { reservationModel } from '../../models/reservation.model';
import { User } from '../../models/user.model';
import { DurationPipe } from "../../pipes/duration.pipe";
import { GeneralService } from '../../services/general.service';
import { HeaderService } from '../../services/header.service';
import { EventService } from '../../services/event.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, DurationPipe],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnDestroy {

  constructor(public headerService: HeaderService, private router: Router, private gn: GeneralService, private eventService: EventService) { }

  isEmpty: boolean = false;
  @Input() isScrolled = false;
  selectedFrequency: string = '';
  selectedGame: string = '';
  duration: number = 0;
  eventsCount: number = 0; //numero di eventi che prendo con chiamata odata
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 0;
  activeFilters: Array<string> = [];

  arrayEvent: EventModel[] = [];
  filteredEvents: EventModel[] = [];
  paginatedEvents: EventModel[] = [];

  userInput: string = '';
  destroy$ = new Subject<void>();

  async ngOnInit() {
    window.scrollTo({ top: 0 });

    this.eventService.getEventCount().subscribe(
      count => {
        this.eventsCount = count;
        this.totalPages = Math.ceil(this.eventsCount / this.itemsPerPage);
        this.loadEvents();
      },
      error => {
        console.error('Error fetching event count:', error);
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEvents() {
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    this.eventService.getPagination(skip, this.itemsPerPage).pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.arrayEvent = res.value;
      this.filteredEvents = res.value;
      this.updatePaginatedEvents();
    });
  }

  filterEvents() {
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    this.eventService.filterEventsByName(this.userInput, skip, this.itemsPerPage).pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.filteredEvents = res.value;
      this.isEmpty = this.filteredEvents.length === 0;
      this.totalPages = Math.ceil(this.filteredEvents.length / this.itemsPerPage);
      this.currentPage = 1;
      this.updatePaginatedEvents();
    });
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
    if (this.selectedFrequency !== '') {
      this.activeFilters.push(this.selectedFrequency);
    }

    if (this.selectedGame !== '') {
      this.activeFilters.push(this.selectedGame);
    }
    this.headerService.filtersVisible = false;
  }

  clearFilter() {
    this.selectedFrequency = '';
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
    this.loadEvents();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEvents();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadEvents();
    }
  }

  navigateToEvent(eventId: number, event: EventModel) {
    this.gn.eventDetail = event;
    this.router.navigate(['/events/', eventId]);
  }
}