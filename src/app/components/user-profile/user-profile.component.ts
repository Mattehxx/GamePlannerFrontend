import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  
  userForm: FormGroup;
  constructor(private formBuilder: FormBuilder) { 

    this.userForm = this.formBuilder.group({

      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      birthdate:["", [Validators.required]],
      canBeMaster:["", [Validators.required]]
    });
  }


  onSubmit() {
  throw new Error('Method not implemented.');
  }
}
