import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../../services/admin.service';
import { GeneralService } from '../../../../services/general.service';
import { UserAdminService } from '../../../../services/user-admin.service';

@Component({
  selector: 'app-modal-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-create-user.component.html',
  styleUrl: './modal-create-user.component.scss'
})
export class ModalCreateUserComponent {

  hidePassword: boolean = true;
  userForm: FormGroup;
  constructor(public as: AdminService, private formBuilder: FormBuilder, private router: Router, private gn: GeneralService,
    private uas: UserAdminService) {
    this.userForm = this.formBuilder.group({

      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      password: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      birthdate: ["", [Validators.required]]
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    throw new Error('Method not implemented.');
  }

  createUser() {
    this.uas.createAdminUser({
      name: this.userForm.value.name,
      surname: this.userForm.value.surname,
      email: this.userForm.value.email,
      phone: this.userForm.value.phone,
      birthDate: this.userForm.value.birthdate,
      password: this.userForm.value.password
    }).subscribe({
      next: (res) => {
        this.uas.getUsers();
        this.gn.confirmMessage = "User created successfully";
        this.gn.setConfirm();
        this.closeModal();
      },
      error: (err) => {
        this.gn.errorMessage = "User could not be created";
        this.gn.setError();
      }
    });
  }

  closeModal() {
    this.gn.isOverlayOn$.next(false);
    this.as.isCreateUserModal = false;
  }
}
