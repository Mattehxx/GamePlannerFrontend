import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserProfileComponent } from '../components/user-profile/user-profile.component';
import { UsersAdminComponent } from '../components/admin/users-admin/users-admin.component';
import { UserModalsComponent } from '../components/modals/user-modals/user-modals.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {


  
  private dialogRef: MatDialogRef<UserModalsComponent> | null = null;

  constructor(private dialog: MatDialog) { }
  openDialog() {
    const dialogRef = this.dialog.open(UserModalsComponent, {
      width: '50vh',
      height: '30vh'
    });
    return dialogRef;
  }


  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close(); 
      this.dialogRef = null; 
    }
  }


}
