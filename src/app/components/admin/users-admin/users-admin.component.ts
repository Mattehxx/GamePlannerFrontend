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


  constructor(public ds: DashboardService, public headerService: HeaderService, public as: AdminService, private router : Router,private gn:GeneralService, public aus: UserAdminService) { }


  displayedColumns: string[] = ['user', 'email', 'phoneNumber', 'role'];
  dataSource = new MatTableDataSource<User>([
    { userId: '1', imgUrl: 'assets/images/mockup-img/user/Img1.jpeg', name: 'Jane', surname: 'Doe', isDeleted: false, email: 'jane.doe@example.com', phoneNumber: '+1234567890', role: 'Admin' },
    { userId: '2', imgUrl: 'assets/images/mockup-img/user/Img2.jpeg', name: 'John', surname: 'Smith', isDeleted: true, email: 'john.smith@example.com', phoneNumber: '+0987654321', role: 'User'},
    { userId: '3', imgUrl: 'assets/images/mockup-img/user/Img3.jpeg', name: 'Alice', surname: 'Johnson', isDeleted: false, email: 'alice.johnson@example.com', phoneNumber: '+1122334455', role: 'Moderator' },
    { userId: '4', imgUrl: 'assets/images/mockup-img/user/Img4.jpeg', name: 'Bob', surname: 'Brown', isDeleted: false, email: 'bob.brown@example.com', phoneNumber: '+5566778899', role: 'Admin'},
    { userId: '5', imgUrl: 'assets/images/mockup-img/user/Img5.jpeg', name: 'Charlie', surname: 'Davis', isDeleted: true, email: 'charlie.davis@example.com', phoneNumber: '+6677889900', role: 'User'},
    { userId: '6', imgUrl: 'assets/images/mockup-img/user/Img6.jpeg', name: 'Eve', surname: 'Miller', isDeleted: false, email: 'eve.miller@example.com', phoneNumber: '+7788990011', role: 'User'},
    { userId: '7', imgUrl: 'assets/images/mockup-img/user/Img7.jpeg', name: 'Frank', surname: 'Wilson', isDeleted: true, email: 'frank.wilson@example.com', phoneNumber: '+8899001122', role: 'Moderator',},
    { userId: '8', imgUrl: 'assets/images/mockup-img/user/Img8.jpeg', name: 'Grace', surname: 'Taylor', isDeleted: false, email: 'grace.taylor@example.com', phoneNumber: '+9900112233', role: 'Admin',  },
    { userId: '9', imgUrl: 'assets/images/mockup-img/user/Img9.jpeg', name: 'Hank', surname: 'Anderson', isDeleted: true, email: 'hank.anderson@example.com', phoneNumber: '+0011223344', role: 'User', },
    { userId: '10', imgUrl: 'assets/images/mockup-img/user/Img10.jpeg', name: 'Ivy', surname: 'Thomas', isDeleted: false, email: 'ivy.thomas@example.com', phoneNumber: '+1122334455', role: 'Moderator',  },
    { userId: '11', imgUrl: 'assets/images/mockup-img/user/Img11.jpeg', name: 'Jack', surname: 'White', isDeleted: false, email: 'jack.white@example.com', phoneNumber: '+2233445566', role: 'User',  },
    { userId: '12', imgUrl: 'assets/images/mockup-img/user/Img12.jpeg', name: 'Kara', surname: 'Hall', isDeleted: true, email: 'kara.hall@example.com', phoneNumber: '+3344556677', role: 'Admin', },
    { userId: '13', imgUrl: 'assets/images/mockup-img/user/Img13.jpeg', name: 'Leo', surname: 'Lee', isDeleted: false, email: 'leo.lee@example.com', phoneNumber: '+4455667788', role: 'User', },
    { userId: '14', imgUrl: 'assets/images/mockup-img/user/Img14.jpeg', name: 'Mona', surname: 'King', isDeleted: false, email: 'mona.king@example.com', phoneNumber: '+5566778899', role: 'Moderator',  },
    { userId: '15', imgUrl: 'assets/images/mockup-img/user/Img15.jpeg', name: 'Nina', surname: 'Wright', isDeleted: true, email: 'nina.wright@example.com', phoneNumber: '+6677889900', role: 'Admin', }

  ]


  );
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(){
    this.aus.User$.pipe(takeUntil(this.death$)).subscribe({
      next: (games) => {
        this.dataSource.data = games;
        console.log(games);
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



    if (this.ds.userDetailPanel && user?.userId === this.selectedUser?.userId) {
      this.ds.userDetailPanel = false;
    }
    else if (this.ds.userDetailPanel && user === undefined) {
      this.ds.userDetailPanel = false;
    }
    else {
      this.selectedUser = user
      this.ds.userDetailPanel = true;
    }

    console.log(user, "user", this.selectedUser, "selectedUser")
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
