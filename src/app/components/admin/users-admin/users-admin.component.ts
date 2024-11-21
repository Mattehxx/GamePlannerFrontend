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
import { createPatch } from 'rfc6902';

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


  constructor(public ds: DashboardService, public headerService: HeaderService, public as: AdminService, private router: Router, private gn: GeneralService, public uas: UserAdminService) { }


  displayedColumns: string[] = ['user', 'email','phoneNumber',  'role']; 
  dataSource = new MatTableDataSource<User>([]);
  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {
    this.ds.userDetailPanel = false;
    this.gn.isLoadingScreen$.next(true);
    this.isLoading = true;
    this.uas.User$.pipe(takeUntil(this.death$)).subscribe({
      next: (games) => {
        this.dataSource.data = games;
      }
    })
    this.uas.getUsers().then(() => {
      this.gn.isLoadingScreen$.next(false);
      this.isLoading = false;
    });;

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
    else if (this.ds.userDetailPanel === true && this.selectedUser === user) {
      this.ds.userDetailPanel = false;
    }
    else if (user === undefined) {
      this.ds.userDetailPanel = false
    }
    else {
      this.selectedUser = user
      this.ds.userDetailPanel = true
    }
  }

  ableOrDisableUser() {

    if (this.selectedUser) {
      let modifiedObject: User = { ...this.selectedUser, isDisabled: !this.selectedUser?.isDisabled };

      let patch = createPatch(this.selectedUser, modifiedObject);

      this.uas.changeUserStatus(this.selectedUser!, patch).then((res) => {
        this.selectedUser!.isDisabled = !this.selectedUser?.isDisabled;
        this.uas.getUsers();
        this.gn.confirmMessage = `User ${this.selectedUser!.isDisabled ? 'disabled' : 'enabled'} successfully`;
        this.gn.setConfirm();
      })
      .catch((err) => {
        this.gn.defErrMessage = "User could not be disabled";
        this.gn.setError();
      });
    }
  }

  openDeleteModal() {
    this.gn.isOverlayOn$.next(true);
    this.as.isDeleteUserModal = true;
  }

  closeModal() {
    this.gn.isOverlayOn$.next(false);
    this.as.isDeleteUserModal = false;
  }

  openCreateUserModal() {
    this.gn.isOverlayOn$.next(true);
    this.as.isCreateUserModal = true
  }

  delete(id: string) {
    this.uas.deleteUser(id!).then((res) => {
      this.closeModal();
      this.ds.userDetailPanel = false;
      this.uas.getUsers();
      this.gn.confirmMessage = "User deleted successfully";
      this.gn.setConfirm();
    }).catch((err) => {
      this.gn.defErrMessage = "User could not be deleted";
      this.gn.setError();
    });
  }

}
