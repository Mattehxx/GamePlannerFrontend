import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../../../services/general.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-modal-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-create-user.component.html',
  styleUrl: './modal-create-user.component.scss'
})
export class ModalCreateUserComponent{
  
  hidePassword: boolean = true;
  userForm: FormGroup;
  constructor(public as: AdminService, private formBuilder: FormBuilder, private router: Router,private gn: GeneralService) {


    this.userForm = this.formBuilder.group({

      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      password: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      birthdate: ["", [Validators.required]],
      canBeMaster: [false, [Validators.required]]
    });
  }

 

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    throw new Error('Method not implemented.');
  }

  createUser() {
    throw new Error('Method not implemented.');
    }

  closeModal() {
    this.gn.isOverlayOn$.next(false);
    this.as.isCreateUserModal = false;
  }
}
