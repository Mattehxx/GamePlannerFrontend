import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createPatch } from 'rfc6902';
import { GameModel } from '../../models/game.model';
import { knowledgeModel } from '../../models/knowledge.model';
import { preferenceInputModel } from '../../models/preference.model';
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
  originalModel: User | null = null;
  viewMode: string = 'default';
  games: GameModel[] = [];
  knowledges: knowledgeModel[] = [];
  deepCopy: User | undefined;
  formattedBirthdate: string = "";
  modelToEdit: User = {
    name: '',
    surname: '',
    email: '',
    imgUrl: '',
    birthDate: new Date(),
    role: '',
    preferences: [],
  };

  newPreference: preferenceInputModel = {
    canBeMaster: false,
    userId: "",
    knowledgeId: 0,
    gameId: 0,
  };

  constructor(public as: AuthService, public gs: GameService, public ks: KnowledgeService) { }

  ngOnInit(): void {
    if (this.as.isLogged) {
      this.as.user?.subscribe({
        next: (user) => {
          if (user) {
            this.originalModel = user;
            this.modelToEdit = { ...user };
            this.deepCopy = JSON.parse(JSON.stringify(user));
            this.formattedBirthdate = this.formatDate(this.modelToEdit.birthDate?.toString() ?? '');
            console.log(new Date(this.formattedBirthdate));
            console.log('UserEdit:', this.modelToEdit);
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
  removeImg() {
    if (this.modelToEdit) {
      this.modelToEdit.imgUrl = "";
    }
  }
  resetUserInfo() {
    this.modelToEdit = { ...this.deepCopy! };
    this.viewMode = 'default';
  }
  SaveChanges() {
    this.onSubmit();
  }
  onSubmit(): void {
    if (this.selectedImageFile) {
      const data = new FormData();
      data.append('file', this.selectedImageFile);
      this.as.updateProfileImg(data);
    }
    //this.modelToEdit.birthDate = new Date(this.formattedBirthdate);
    this.modelToEdit.birthDate = new Date(this.formattedBirthdate);
    console.log(this.modelToEdit);
    let patch = createPatch(this.deepCopy, this.modelToEdit);
    this.as.patchUser(this.deepCopy!, patch).then((res) => {
      this.viewMode = 'default';
      this.modelToEdit = this.as.user?.value!;
    });
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      console.log(file);
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


  //#region utility
  formatDate(value: string): string {
    if (!value) return '';

    const date = new Date(value);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  //#endregion
};


