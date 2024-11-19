import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GameModel } from '../../models/game.model';
import { knowledgeModel } from '../../models/knowledge.model';
import { preferenceModel } from '../../models/preference.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { KnowledgeService } from '../../services/knowledge.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {

  PostPreference() {
    throw new Error('Method not implemented.');
    //Post di reference
  }

  selectedImageFile: File | undefined;
  selectedImagePreview: string | undefined;
  games: GameModel[] = [];
  knowledges: knowledgeModel[] = [];
  userToEdit: User | null = null;
  originalUser: User | null = null;
  userForm: FormGroup;
  viewMode: string = 'default';

  constructor(public as: AuthService, private fb: FormBuilder, public gs: GameService, public ks: KnowledgeService) {
    this.games = this.gs.Games$.value;
    this.userForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      name: [null, Validators.required],
      surname: [null, Validators.required],
      phone: [null],
      birthdate: [null],
      preferences: this.fb.array([])
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
            this.setPreferences(user.preferences ?? []);
          } else {
            console.error('User is undefined');
          }
        },
        error: (error) => {
          console.error('Error fetching user:', error);
        }
      });
    }
    this.gs.Games$.subscribe({
      next: (games) => {
        this.games = games;
      }
    })
    this.ks.Knowledges$.subscribe({
      next: (knowledges) => {
        this.knowledges = knowledges;
      },
    })
  }
  changeViewMode(viewMode: string) {
    this.viewMode = viewMode;
  }
  setPreferences(preferences: preferenceModel[]): void {
    const preferenceFGs = preferences.map(pref => this.fb.group(pref));
    const preferenceFormArray = this.fb.array(preferenceFGs);
    this.userForm.setControl('preferences', preferenceFormArray);
  }

  // addPreference(): void {
  //   this.preferences.push(this.fb.control('', Validators.required));
  // }

  // removePreference(index: number): void {
  //   this.preferences.removeAt(index);
  // }

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
    this.viewMode = 'default';
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const updatedUser = { ...this.userToEdit, ...this.userForm.value };
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        console.error('The selected file is not an image.');
        return;
      }
      this.selectedImageFile = file;
      const reader = new FileReader();

      reader.onload = () => {
        this.selectedImagePreview = reader.result as string;
      };

      reader.onerror = () => {
        console.error('Error reading file.');
      };

      reader.readAsDataURL(file);
    }
  }
  get preferences(): FormArray {
    return this.userForm.get('preferences') as FormArray;
  }
}
