import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from '../../../models/user.model';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { HeaderService } from '../../../services/header.service';
import { MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from '../../../services/general.service';
import { ModalCreateUserComponent } from "./modal-create-user/modal-create-user.component";

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [CommonModule, // Usa CommonModule invece di BrowserModule qui
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatPaginator, ModalCreateUserComponent],
  templateUrl: './users-admin.component.html',
  styleUrl: './users-admin.component.scss'
})
export class UsersAdminComponent implements AfterViewInit {



  constructor(public ds: DashboardService, public headerService: HeaderService, public gn: GeneralService,) { }

  selectedUser: User | undefined;

  displayedColumns: string[] = ['user', 'email', 'phone', 'role'];
  dataSource = new MatTableDataSource<User>([
    { userId: '1', imgUrl: 'assets/images/mockup-img/Img1.jpeg', name: 'Jane', surname: 'Doe', isDeleted: false, email: 'jane.doe@example.com', phone: '+1234567890', role: 'Admin', canBeMaster: true },
    { userId: '2', imgUrl: 'assets/images/mockup-img/Img2.jpeg', name: 'John', surname: 'Smith', isDeleted: true, email: 'john.smith@example.com', phone: '+0987654321', role: 'User', canBeMaster: false },
    { userId: '3', imgUrl: 'assets/images/mockup-img/Img3.jpeg', name: 'Alice', surname: 'Johnson', isDeleted: false, email: 'alice.johnson@example.com', phone: '+1122334455', role: 'Moderator', canBeMaster: true },
    { userId: '4', imgUrl: 'assets/images/mockup-img/Img4.jpeg', name: 'Bob', surname: 'Brown', isDeleted: false, email: 'bob.brown@example.com', phone: '+5566778899', role: 'Admin', canBeMaster: true },
    { userId: '5', imgUrl: 'assets/images/mockup-img/Img5.jpeg', name: 'Charlie', surname: 'Davis', isDeleted: true, email: 'charlie.davis@example.com', phone: '+6677889900', role: 'User', canBeMaster: false },
    { userId: '6', imgUrl: 'assets/images/mockup-img/Img6.jpeg', name: 'Eve', surname: 'Miller', isDeleted: false, email: 'eve.miller@example.com', phone: '+7788990011', role: 'User', canBeMaster: true },
    { userId: '7', imgUrl: 'assets/images/mockup-img/Img7.jpeg', name: 'Frank', surname: 'Wilson', isDeleted: true, email: 'frank.wilson@example.com', phone: '+8899001122', role: 'Moderator', canBeMaster: false },
    { userId: '8', imgUrl: 'assets/images/mockup-img/Img8.jpeg', name: 'Grace', surname: 'Taylor', isDeleted: false, email: 'grace.taylor@example.com', phone: '+9900112233', role: 'Admin', canBeMaster: true },
    { userId: '9', imgUrl: 'assets/images/mockup-img/Img9.jpeg', name: 'Hank', surname: 'Anderson', isDeleted: true, email: 'hank.anderson@example.com', phone: '+0011223344', role: 'User', canBeMaster: false },
    { userId: '10', imgUrl: 'assets/images/mockup-img/Img10.jpeg', name: 'Ivy', surname: 'Thomas', isDeleted: false, email: 'ivy.thomas@example.com', phone: '+1122334455', role: 'Moderator', canBeMaster: true },
    { userId: '11', imgUrl: 'assets/images/mockup-img/Img11.jpeg', name: 'Jack', surname: 'White', isDeleted: false, email: 'jack.white@example.com', phone: '+2233445566', role: 'User', canBeMaster: false },
    { userId: '12', imgUrl: 'assets/images/mockup-img/Img12.jpeg', name: 'Kara', surname: 'Hall', isDeleted: true, email: 'kara.hall@example.com', phone: '+3344556677', role: 'Admin', canBeMaster: false },
    { userId: '13', imgUrl: 'assets/images/mockup-img/Img13.jpeg', name: 'Leo', surname: 'Lee', isDeleted: false, email: 'leo.lee@example.com', phone: '+4455667788', role: 'User', canBeMaster: true },
    { userId: '14', imgUrl: 'assets/images/mockup-img/Img14.jpeg', name: 'Mona', surname: 'King', isDeleted: false, email: 'mona.king@example.com', phone: '+5566778899', role: 'Moderator', canBeMaster: true },
    { userId: '15', imgUrl: 'assets/images/mockup-img/Img15.jpeg', name: 'Nina', surname: 'Wright', isDeleted: true, email: 'nina.wright@example.com', phone: '+6677889900', role: 'Admin', canBeMaster: false }

  ]


  );
  @ViewChild(MatPaginator) paginator!: MatPaginator;




  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void { }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  toggleFilters(user: User | undefined) {



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
    this.gn.isDeleteUserModal = true;
  }

  closeModal() {
    this.gn.isDeleteUserModal = false;
  }

  openCreateUserModal() {
    this.gn.isCreateUserModal = true
  }

}
