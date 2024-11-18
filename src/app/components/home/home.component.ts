import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventModel } from '../../models/event.model';
import { DurationPipe } from '../../pipes/duration.pipe';
import { User } from '../../models/user.model';
import { gameSessionModel } from '../../models/gameSession.model';
import { Router, RouterLink } from '@angular/router';
import { reservationModel } from '../../models/reservation.model';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule,DurationPipe,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit,OnDestroy{

  //#region Models
  admin: User = {
    userId: 'sfasf',
    name: 'Yassine',
    surname: 'admin',
    email: '',
    phone: '',
    birthDate: new Date('1995-01-01'),
    imgUrl: '',
    canBeMaster: true,
    level: 1,
    isDeleted: false,
    role: 'User'
  }

  reservation: reservationModel = {
    reservationId: 1,
    token: '',
    isConfirmed: false,
    isDeleted: false,
    sessionId: 1,
    userId: '1',
  }

  gameSession: gameSessionModel = {
    sessionId: 1,
    startDate: new Date('2023-11-01'),
    endDate: new Date('2023-11-02'),
    isDeleted: false,
    masterId: '301',
    eventId: 1,
    master: this.admin,
    seats: 4,
    gameId: 101,
    reservations: [this.reservation]
  }


  arrayEvent: EventModel[] = [
    {
      eventId: 1,
      name: 'Event 1',
      description: 'Description for Event 1',
      isPublic: true,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: false,
      adminId: 201,
      admin: this.admin,
      gameSessions: [this.gameSession]
    },
    {
      eventId: 2,
      name: 'Event 2',
      description: 'Description for Event 2',
      isPublic: false,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: false,
      adminId: 202,
      admin: this.admin,
      gameSessions: [this.gameSession]
    },
    {
      eventId: 3,
      name: 'Event 3',
      description: 'Description for Event 3',
      isPublic: true,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: false,
      adminId: 203,
      gameSessions: [this.gameSession]
    },
    {
      eventId: 4,
      name: 'Event 4',
      description: 'Description for Event 4',
      isPublic: false,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: false,
      adminId: 204,
      gameSessions: [this.gameSession]
    },
    {
      eventId: 4,
      name: 'Event 4',
      description: 'Description for Event 4',
      isPublic: false,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: false,
      adminId: 204,
      gameSessions: [this.gameSession]
    },
    {
      eventId: 4,
      name: 'Event 4',
      description: 'Description for Event 4',
      imgUrl: '/assets/images/wallpaper2.jpg',
      isPublic: false,
      isDeleted: false,
      adminId: 204
    },
    {
      eventId: 4,
      name: 'Event 4',
      description: 'Description for Event 4',
      isPublic: false,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: false,
      adminId: 204
    }
  ];
//#endregion
  constructor(public router: Router,protected eventService : EventService){}
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    this.eventService.getUpcomingEvents();
  }

  @ViewChild('eventList') eventList!: ElementRef;

  private touchStartX: number = 0;
  private touchEndX: number = 0;

  handleTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  handleTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipe();
  }

  private handleSwipe() {
    const swipeDistance = this.touchEndX - this.touchStartX;
    const container = this.eventList.nativeElement;
    const scrollAmount = container.offsetWidth * 0.8;
  }

  scrollLeft() {
    const container = this.eventList.nativeElement;
    const scrollAmount = container.offsetWidth * 0.2;
    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    const container = this.eventList.nativeElement;
    const scrollAmount = container.offsetWidth * 0.2; // Scroll 80% of container width
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }

  navigateToEvent(){
    this.router.navigate(['/events']);
  }

}
