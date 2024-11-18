import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GameModel } from '../../models/game.model';
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

  userForm: FormGroup;

  constructor(public as: AuthService, private formBuilder: FormBuilder) {
    this.userToEdit = this.as.user

    this.userForm = this.formBuilder.group({
      email: [this.userToEdit?.email, [Validators.required, Validators.email]],
      name: [this.userToEdit?.name, [Validators.required]],
      surname: [this.userToEdit?.surname, [Validators.required]],
      phone: [this.userToEdit?.phone, [Validators.required]],
      birthdate: [this.userToEdit?.birthDate, [Validators.required]],
      canBeMaster: [this.userToEdit?.canBeMaster, [Validators.required]]
    });
  }

  userToEdit: User | undefined;
  games: Array<GameModel> = [];

  ngOnInit(): void {
    //get game
    //subscribe a behavioursubject
  }
  onSubmit() {
    throw new Error('Method not implemented.');
  }
}
