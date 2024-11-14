import { Component } from '@angular/core';
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

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [CommonModule, // Usa CommonModule invece di BrowserModule qui
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule],
  templateUrl: './users-admin.component.html',
  styleUrl: './users-admin.component.scss'
})
export class UsersAdminComponent {
  constructor(public ds: DashboardService) { }

  displayedColumns: string[] = ['profilePicture', 'firstName', 'lastName', 'status'];
  dataSource = new MatTableDataSource<User>( [
    { imgUrl: 'path/to/image1.jpg', name: 'Jane', surname: 'Doe', isDeleted: false, email: 'jane.doe@example.com', phone: '+1234567890', role: 'Admin' },
    { imgUrl: 'path/to/image2.jpg', name: 'John', surname: 'Smith', isDeleted: true, email: 'john.smith@example.com', phone: '+0987654321', role: 'User' },
    { imgUrl: 'path/to/image3.jpg', name: 'Alice', surname: 'Johnson', isDeleted: false, email: 'alice.johnson@example.com', phone: '+1122334455', role: 'Moderator' },
    { imgUrl: 'path/to/image4.jpg', name: 'Bob', surname: 'Brown', isDeleted: false, email: 'bob.brown@example.com', phone: '+5566778899', role: 'Admin' },
    { imgUrl: 'path/to/image5.jpg', name: 'Charlie', surname: 'Davis', isDeleted: true, email: 'charlie.davis@example.com', phone: '+6677889900', role: 'User' },
    { imgUrl: 'path/to/image6.jpg', name: 'Eve', surname: 'Miller', isDeleted: false, email: 'eve.miller@example.com', phone: '+7788990011', role: 'User' },
    { imgUrl: 'path/to/image7.jpg', name: 'Frank', surname: 'Wilson', isDeleted: true, email: 'frank.wilson@example.com', phone: '+8899001122', role: 'Moderator' },
    { imgUrl: 'path/to/image8.jpg', name: 'Grace', surname: 'Taylor', isDeleted: false, email: 'grace.taylor@example.com', phone: '+9900112233', role: 'Admin' },
    { imgUrl: 'path/to/image9.jpg', name: 'Hank', surname: 'Anderson', isDeleted: true, email: 'hank.anderson@example.com', phone: '+0011223344', role: 'User' },
    { imgUrl: 'path/to/image10.jpg', name: 'Ivy', surname: 'Thomas', isDeleted: false, email: 'ivy.thomas@example.com', phone: '+1122334455', role: 'Moderator' },
    { imgUrl: 'path/to/image11.jpg', name: 'Jack', surname: 'White', isDeleted: false, email: 'jack.white@example.com', phone: '+2233445566', role: 'User' },
    { imgUrl: 'path/to/image12.jpg', name: 'Kara', surname: 'Hall', isDeleted: true, email: 'kara.hall@example.com', phone: '+3344556677', role: 'Admin' },
    { imgUrl: 'path/to/image13.jpg', name: 'Leo', surname: 'Lee', isDeleted: false, email: 'leo.lee@example.com', phone: '+4455667788', role: 'User' },
    { imgUrl: 'path/to/image14.jpg', name: 'Mona', surname: 'King', isDeleted: false, email: 'mona.king@example.com', phone: '+5566778899', role: 'Moderator' },
    { imgUrl: 'path/to/image15.jpg', name: 'Nina', surname: 'Wright', isDeleted: true, email: 'nina.wright@example.com', phone: '+6677889900', role: 'Admin' },
]);

  ngOnInit(): void { }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
