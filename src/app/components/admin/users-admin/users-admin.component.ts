import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { AdminService } from '../../../services/admin.service';
import { DashboardService } from '../../../services/dashboard.service';
import { GeneralService } from '../../../services/general.service';
import { HeaderService } from '../../../services/header.service';
import { ModalCreateUserComponent } from "./modal-create-user/modal-create-user.component";
import { UserAdminService } from '../../../services/user-admin.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatPaginator,
    ModalCreateUserComponent],
  templateUrl: './users-admin.component.html',
  styleUrl: './users-admin.component.scss'
})
export class UsersAdminComponent implements OnInit, AfterViewInit {

  selectedUser: User | undefined;
  death$ = new Subject<void>();


  constructor(public ds: DashboardService, public headerService: HeaderService, public as: AdminService, private router: Router, private gn: GeneralService, public aus: UserAdminService) { }


  displayedColumns: string[] = ['user', 'email', 'phoneNumber', 'role'];
  dataSource = new MatTableDataSource<User>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {
    this.aus.User$.pipe(takeUntil(this.death$)).subscribe({
      next: (games) => {
        this.dataSource.data = games;
      }
    })
    this.aus.getUsers();

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }



  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  toggleUserDetails(user: User | undefined) {

    if (this.ds.userDetailPanel === false) {
      this.ds.userDetailPanel = true;
      this.selectedUser = user;
    }
    else if(this.ds.userDetailPanel === true && this.selectedUser === user) {
      this.ds.userDetailPanel = false;
    }
    else{
      this.selectedUser = user
      this.ds.userDetailPanel = true
    }
  }

  ableOrDisableUser() {
    this.selectedUser!.isDeleted = !this.selectedUser?.isDeleted
  }

  openDeleteModal() {
    this.as.isDeleteUserModal = true;
  }

  closeModal() {
    this.as.isDeleteUserModal = false;
  }

  openCreateUserModal() {
    this.gn.isOverlayOn$.next(true);
    this.as.isCreateUserModal = true
  }

}
