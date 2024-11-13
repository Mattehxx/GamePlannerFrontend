import { Component } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-events-admin',
  standalone: true,
  imports: [],
  templateUrl: './events-admin.component.html',
  styleUrl: './events-admin.component.scss'
})
export class EventsAdminComponent {
  constructor(public ds: DashboardService){}
}
