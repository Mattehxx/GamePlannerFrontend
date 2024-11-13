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
  dataSource = new MatTableDataSource<User>([
    { imgUrl: 'path/to/image1.jpg', name: 'Jane', surname: 'Doe', isDeleted: 'Enabled' },
  { imgUrl: 'path/to/image2.jpg', name: 'John', surname: 'Smith', isDeleted: 'Disabled' },
  { imgUrl: 'path/to/image3.jpg', name: 'Alice', surname: 'Johnson', isDeleted: 'Enabled' },
  { imgUrl: 'path/to/image4.jpg', name: 'Bob', surname: 'Brown', isDeleted: 'Disabled' },
  { imgUrl: 'path/to/image5.jpg', name: 'Charlie', surname: 'Davis', isDeleted: 'Enabled' },
  { imgUrl: 'path/to/image6.jpg', name: 'Eve', surname: 'Miller', isDeleted: 'Disabled' },
  { imgUrl: 'path/to/image7.jpg', name: 'Frank', surname: 'Wilson', isDeleted: 'Enabled' },
  { imgUrl: 'path/to/image8.jpg', name: 'Grace', surname: 'Moore', isDeleted: 'Disabled' },
  { imgUrl: 'path/to/image9.jpg', name: 'Hannah', surname: 'Taylor', isDeleted: 'Enabled' },
  { imgUrl: 'path/to/image10.jpg', name: 'Isaac', surname: 'Anderson', isDeleted: 'Disabled' }
]);

  ngOnInit(): void { }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
