import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { EventModel } from '../../../models/event.model';
import { gameSessionModel } from '../../../models/gameSession.model';
import { reservationModel } from '../../../models/reservation.model';
import { User } from '../../../models/user.model';
import { DashboardService } from '../../../services/dashboard.service';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-events-admin',
  standalone: true,
  imports: [CommonModule,FormsModule,MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatPaginator],
  templateUrl: './events-admin.component.html',
  styleUrl: './events-admin.component.scss'
})
export class EventsAdminComponent implements AfterViewInit {
  
  constructor(public ds: DashboardService,public eventService: EventService,private router: Router){}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['Event', 'Admin', 'Sessions', 'Visibility', 'Actions'];

  admin: User = {
    userId: 'sfasf',
    name: 'Yassine',
    surname: 'Char',
    email: '',
    phoneNumber: '',
    birthDate: new Date('1995-01-01'),
    imgUrl: '/assets/images/pfp.jpg',
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
    user: this.admin
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


  dataSource = new MatTableDataSource<EventModel>([
    {
      eventId: 1,
      name: 'Event 1',
      description: 'Description for Event 1',
      isPublic: true,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: false,
      adminId: 201,
      admin: this.admin,
      sessions: [this.gameSession]
    },  
    {
      eventId: 1,
      name: 'Event 2',
      description: 'Description for Event 1',
      isPublic: true,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: true,
      adminId: 201,
      admin: this.admin,
      sessions: [this.gameSession]
    },  
    {
      eventId: 1,
      name: 'Event 3',
      description: 'Description for Event 1',
      isPublic: true,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: false,
      adminId: 201,
      admin: this.admin,
      sessions: [this.gameSession]
    },    
  ]);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: EventModel, filter: string) => {
      return data.name.toLowerCase().includes(filter);
    };
  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openCreateEventModal() {
    
  }

  toggleFilters( ) {

  }

  goToEventDetail(event: EventModel) {
    this.eventService.eventDetail = event;
    this.router.navigate([`dashboard-admin/events/${event.eventId}`]);
  }

}
