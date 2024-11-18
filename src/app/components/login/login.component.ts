import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  hidePassword: boolean = true;

  constructor(private formBuilder: FormBuilder,public router: Router, private as: AuthService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  loginForm: FormGroup;

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(){
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      this.as.login({email: this.loginForm.value.email, password: this.loginForm.value.password});
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
