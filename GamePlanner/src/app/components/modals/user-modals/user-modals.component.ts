import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-modals',
  standalone: true,
  imports: [],
  templateUrl: './user-modals.component.html',
  styleUrl: './user-modals.component.scss'
})
export class UserModalsComponent {
  
  constructor(private dialogRef: MatDialogRef<UserModalsComponent>) { }
  closeModal(): void {
    this.dialogRef.close(); 
  }
}
