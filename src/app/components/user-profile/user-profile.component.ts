import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  userForm: FormGroup;

  constructor(public as: AuthService, private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      email: [this.as.user?.email, [Validators.required, Validators.email]],
      name: [this.as.user?.name, [Validators.required]],
      surname: [this.as.user?.surname, [Validators.required]],
      phone: [this.as.user?.phone, [Validators.required]],
      birthdate: [this.as.user?.birthDate, [Validators.required]],
      canBeMaster: [this.as.user?.canBeMaster, [Validators.required]]
    });
    
    this.userToEdit = this.as.user
  }

  userToEdit: User | undefined;
  onSubmit() {
    throw new Error('Method not implemented.');
  }
}
