import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [RouterLink,CommonModule,RouterOutlet],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent implements OnInit{
  
  isSidebarOpen: boolean = false;

  constructor(public ds:DashboardService, public router: Router){}

  ngOnInit(){
    // this.isOpen = this.ds.isOpen;
  }
  
  onMouseEnter() {
    console.log (this.ds.isOpen)
    this.ds.isOpen = true;
    console.log (this.ds.isOpen)

  }
  onMouseLeave() {
    this.ds.isOpen = false;
  }
}
