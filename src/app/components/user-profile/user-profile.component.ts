import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class UserProfileComponent implements OnInit {
  userToEdit: User | null = null;
  originalUser: User | null = null;
  userForm: FormGroup;

  constructor(public as: AuthService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      name: [null, Validators.required],
      surname: [null, Validators.required],
      phone: [null],
      birthdate: [null]
    });
  }

  ngOnInit(): void {
    if (this.as.isLogged) {
      this.as.user?.subscribe({
        next: (user) => {
          if (user) {
            this.originalUser = { ...user };
            this.userToEdit = { ...user };
            this.userForm.controls['email'].setValue(user.email ?? null);
            this.userForm.controls['name'].setValue(user.name);
            this.userForm.controls['surname'].setValue(user.surname);
            this.userForm.controls['phone'].setValue(user.phoneNumber ?? null);
            this.userForm.controls['birthdate'].setValue(user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : null);
          } else {
            console.error('User is undefined');
          }
        },
        error: (error) => {
          console.error('Error fetching user:', error);
        }
      });
    }
  }

  removeImg() {
    if (this.userToEdit) {
      this.userToEdit.imgUrl = "";
    }
  }

  resetUserInfo() {
    if (this.originalUser) {
      this.userToEdit = { ...this.originalUser };
      this.userForm.controls['email'].setValue(this.originalUser.email ?? null);
      this.userForm.controls['name'].setValue(this.originalUser.name);
      this.userForm.controls['surname'].setValue(this.originalUser.surname);
      this.userForm.controls['phone'].setValue(this.originalUser.phoneNumber ?? null);
      this.userForm.controls['birthdate'].setValue(this.originalUser.birthDate ? new Date(this.originalUser.birthDate).toISOString().split('T')[0] : null);
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const updatedUser = { ...this.userToEdit, ...this.userForm.value };
      // Esegui la patch con updatedUser
      console.log('Updated user:', updatedUser);
    }
  }
}
