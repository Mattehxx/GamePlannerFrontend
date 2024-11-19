import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { createPatch } from 'rfc6902';
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

  ImgUrlPut() {
    //put di img, poi fare patch con url che ritorna
  }

  selectedImageFile: File | undefined;
  selectedImagePreview: string | undefined;
  games: GameModel[] = [];
  knowledges: knowledgeModel[] = [];
  originalModel: User | null = null;
  copyModel: User | null = null;
  userForm: FormGroup;
  viewMode: string = 'default';

  constructor(public as: AuthService, private fb: FormBuilder, public gs: GameService, public ks: KnowledgeService) {
    this.games = this.gs.Games$.value;
    this.userForm = this.fb.group({
      id: [null, Validators.required],
      name: [null, Validators.required],
      surname: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phoneNumber: [null],
      birthDate: [null],
      imgUrl: [null, Validators.required],
      level: [null, Validators.required],
      isDeleted: [null, Validators.required],
      role: [null, Validators.required],
      adminEvent: this.fb.array([]),
      sessions: this.fb.array([]),
      reservations: this.fb.array([]),
      preferences: this.fb.array([])
    });
  }
  ngOnInit(): void {
    if (this.as.isLogged) {
      this.as.user?.subscribe({
        next: (user) => {
          //Trasformare l'oggetto ridotto in un oggetto completo
          if (user) {
            this.originalModel = { ...user };
            this.copyModel = { ...user };
            this.userForm.controls['email'].setValue(user.email ?? null);
            this.userForm.controls['name'].setValue(user.name);
            this.userForm.controls['surname'].setValue(user.surname);
            this.userForm.controls['phoneNumber'].setValue(user.phoneNumber ?? null);
            this.userForm.controls['birthDate'].setValue(user.birthDate ? new Date(user.birthDate).toISOString()[0] : null);
            this.userForm.controls['imgUrl'].setValue(user.imgUrl ?? null);
            this.userForm.controls['level'].setValue(user.level ?? null);
            this.userForm.controls['isDeleted'].setValue(user.isDeleted ?? null);
            this.userForm.controls['role'].setValue(user.role ?? null);
            this.userForm.controls['adminEvent'].setValue(user.adminEvents ?? []);
            this.userForm.controls['sessions'].setValue(user.sessions ?? []);
            this.userForm.controls['reservations'].setValue(user.reservations ?? []);
            this.userForm.controls['id'].setValue(user.reservations ?? []);
            this.userForm.controls['preferences'].setValue(user.preferences ?? []);
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

  removeImg() {
    if (this.copyModel) {
      this.copyModel.imgUrl = "";
    }
  }

  resetUserInfo() {
    this.ngOnInit();
  }
  SaveChanges() {
    this.onSubmit();
  }
  onSubmit(): void {
    //Trasformare l'oggetto ridotto in un oggetto completo
    console.log("original", this.originalModel)
    const newValues = this.userForm.value;

    console.log("edit", newValues)
    if (this.userForm.valid) {
      let patch = createPatch(this.originalModel, newValues)
      this.as.patchUser(this.originalModel!, patch).then((response) => {
        console.log('User updated successfully:', response);
      }).catch((error) => {
        console.error('Error updating user:', error);
      });
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
};


