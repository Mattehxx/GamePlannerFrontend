import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  
  hidePassword: boolean = true;

  constructor(private formBuilder: FormBuilder,public router: Router,private auth: AuthService) {

    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      birthDate: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  registerForm: FormGroup;

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(){
    if (this.registerForm.valid) {
      this.auth.register(this.registerForm.value).then(() => {
        this.router.navigate(['/login']);
      });

    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
