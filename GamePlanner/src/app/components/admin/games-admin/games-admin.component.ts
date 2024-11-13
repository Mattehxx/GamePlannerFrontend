import { Component } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-games-admin',
  standalone: true,
  imports: [],
  templateUrl: './games-admin.component.html',
  styleUrl: './games-admin.component.scss'
})
export class GamesAdminComponent {
  constructor(public ds: DashboardService){}
}
