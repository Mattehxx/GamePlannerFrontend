import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { DashboardService } from '../../../services/dashboard.service';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';
import { GeneralService } from '../../../services/general.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterOutlet],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent implements OnInit {

  user: User | undefined;
  isSidebarOpen: boolean = false;

  constructor(public ds: DashboardService, public router: Router, private as: AdminService, private auth: AuthService, private gn: GeneralService) { }

  ngOnInit() {

    this.auth.user?.subscribe({
      next: (response) => {
        if(response){
          this.user = response;
        }
        
      }
    })

  }
  goToHome(){
    this.as.showGameDetail = false;
    this.gn.isOverlayOn$.next(false);
    setTimeout(() => {
      this.router.navigate(['home']);
    },100);
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


  logOut(){
    this.auth.logout();
  }
}
