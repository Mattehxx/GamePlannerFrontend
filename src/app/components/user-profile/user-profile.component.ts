import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  

  userToEdit: User | undefined;
  userForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    name: new FormControl<string>('', [Validators.required]),
    surname: new FormControl<string>('', [Validators.required]),
    phone: new FormControl<string>('', [Validators.required]),
    birthdate: new FormControl<Date | null>(null, [Validators.required])
  });
  preferenceForm: FormGroup | undefined;

  constructor(public as: AuthService) { }

  ngOnInit(): void {
    if (this.as.isLogged) {
      console.log("ngOnInit: user-profile");
      this.as.user?.subscribe({
        next: (user) => {
          this.userToEdit = user;
          this.userForm.controls['email'].setValue(this.userToEdit.email ?? null);
          this.userForm.controls['name'].setValue(user.name);
          this.userForm.controls['surname'].setValue(user.surname);
          this.userForm.controls['phone'].setValue(user.phone ?? null);
          this.userForm.controls['birthdate'].setValue(user.birthDate ?? null);
        }
      });
      console.log(this.userToEdit);
    }
  }

  onSubmit() {
    throw new Error('Method not implemented.');
  }
}
