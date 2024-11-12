import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventModel } from '../../models/event.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {


  arrayEvent: EventModel[] = [
    {
      name: 'Event 1',
      description: 'Description for Event 1',
      eventDate: new Date('2023-11-01'),
      eventEndDate: new Date('2023-11-02'),
      duration: 24,
      isPublic: true,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: false,
      recurrenceId: 1,
      gameId: 101,
      adminId: 201
    },
    {
      name: 'Event 2',
      description: 'Description for Event 2',
      eventDate: new Date('2023-12-01'),
      eventEndDate: new Date('2023-12-02'),
      duration: 24,
      isPublic: false,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: false,
      recurrenceId: 2,
      gameId: 102,
      adminId: 202
    },
    {
      name: 'Event 3',
      description: 'Description for Event 3',
      eventDate: new Date('2024-01-01'),
      eventEndDate: new Date('2024-01-02'),
      duration: 24,
      isPublic: true,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: false,
      recurrenceId: 3,
      gameId: 103,
      adminId: 203
    },
    {
      name: 'Event 4',
      description: 'Description for Event 4',
      eventDate: new Date('2024-02-01'),
      eventEndDate: new Date('2024-02-02'),
      duration: 24,
      isPublic: false,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDeleted: false,
      recurrenceId: 4,
      gameId: 104,
      adminId: 204
    }
  ];

  constructor(){}

}
