import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterOutlet],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent implements OnInit {


  isSidebarOpen: boolean = false;

  constructor(public ds: DashboardService, public router: Router, private as: AdminService) { }

  ngOnInit() {

  }

  onMouseEnter() {
    this.ds.isOpen = true;
  }
  onMouseLeave() {
    this.ds.isOpen = false;
  }

  closeOverlay() {
    this.as.showGameDetail = false;
    this.as.isCreateUserModal = false;
  }

}
