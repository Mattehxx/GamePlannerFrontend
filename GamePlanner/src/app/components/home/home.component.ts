import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventModel } from '../../models/event.model';
import { DurationPipe } from '../../pipes/duration.pipe';
import { User } from '../../models/user.model';
import { gameSessionModel } from '../../models/gameSession.model';
import { RouterLink } from '@angular/router';
import { reservationModel } from '../../models/reservation.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule,DurationPipe,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


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
    userId: 1,
  }

  gameSession: gameSessionModel = {
    sessionId: 1,
    startDate: new Date('2023-11-01'),
    endDate: new Date('2023-11-02'),
    isDeleted: false,
    masterId: 301,
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

  constructor(){}

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

}
