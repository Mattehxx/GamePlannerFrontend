import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { createPatch } from 'rfc6902';
import { GameModel } from '../../models/game.model';
import { knowledgeModel } from '../../models/knowledge.model';
import { preferenceInputModel, preferenceModel } from '../../models/preference.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { KnowledgeService } from '../../services/knowledge.service';
import { PreferenceService } from '../../services/preference.service';
import { GeneralService } from '../../services/general.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {

  selectedImageFile: File | undefined;
  selectedImagePreview: string | undefined;
  originalModel: User | null = null;
  viewMode: string = 'default';
  games: GameModel[] = [];
  knowledges: knowledgeModel[] = [];
  deepCopy: User | undefined;
  formattedBirthdate: string = "";
  modelToEdit: User | undefined;
  isLoading: boolean = false;

  newPreference: preferenceInputModel = {
    canBeMaster: false,
    userId: "",
    knowledgeId: 0,
    gameId: 0,
  };

  constructor(public as: AuthService, public gs: GameService, public ks: KnowledgeService, protected prefService: PreferenceService, private gn: GeneralService,private router: Router) { }

  ngOnInit(): void {
    if (this.as.isLogged) {
      this.gn.isLoadingScreen$.next(true);
      this.isLoading = true;
      this.as.user?.subscribe({
        next: (user) => {
          if (user) {
            this.originalModel = user;
            this.modelToEdit = { ...user };
            this.deepCopy = JSON.parse(JSON.stringify(user));
            this.formattedBirthdate = this.formatDate(this.modelToEdit.birthDate?.toString() ?? '');

            this.gs.Games$.subscribe({
              next: (games) => {
                console.log(this.modelToEdit)
                const userGames = this.modelToEdit!.preferences?.map(pref => pref.gameId);
                this.games = games.filter(g => !userGames?.includes(g.gameId ?? 0));
              }
            });

            this.ks.Knowledges$.subscribe({
              next: (knowledges) => {
                this.knowledges = knowledges;
              },
            });

            this.gn.isLoadingScreen$.next(false);
            this.isLoading = false;

          }
        },
        error: (error) => {
          console.error('Error fetching user:', error);
        }
      });
    }

  }

  PostPreference() {
    if (this.newPreference.gameId == 0 || this.newPreference.knowledgeId == 0) {
      this.gn.errorMessage = "gameId or knowledgeId not set";
      this.gn.setError();
      throw new Error("gameId or knowledgeId not set");
    }
    this.newPreference.game = this.games.find(g => g.gameId == this.newPreference.gameId);
    this.newPreference.knowledge = this.knowledges.find(k => k.knowledgeId == this.newPreference.knowledgeId);
    this.prefService.toAddPreference.push(this.newPreference);
    this.modelToEdit!.preferences?.push(this.newPreference as preferenceModel);
    this.viewMode = 'default';
    this.newPreference = {
      canBeMaster: false,
      userId: "",
      knowledgeId: 0,
      gameId: 0,
    };

    this.games = this.games.filter(game => !this.modelToEdit!.preferences?.some(pref => pref.gameId === game.gameId));
    console.log(this.modelToEdit!.preferences);
    // this.prefService.post().then(res => {
    //    this.modelToEdit.preferences?.push(res as preferenceModel);
    //    this.deepCopy?.preferences?.push(res as preferenceModel);
    //    this.viewMode = 'default';
    //    this.gn.confirmMessage = "preference created successfully";
    //    this.gn.setConfirm();
    // })
    //   .catch(error => {
    //     console.error(error);
    //     this.gn.errorMessage = "error";
    //     this.gn.setError();
    //   });
  }

  ImgUrlPut() {
    //put di img, poi fare patch con url che ritorna
  }

  changeViewMode(viewMode: string) {
    this.viewMode = viewMode;
  }

  removeImg() {
    if (this.modelToEdit) {
      this.modelToEdit.imgUrl = "";
    }
    if (this.selectedImagePreview) {
      this.selectedImagePreview = "";
      this.selectedImageFile = undefined;
      this.modelToEdit!.imgUrl = this.originalModel?.imgUrl ?? "";
    }
  }

  resetUserInfo() {
    this.modelToEdit = { ...this.deepCopy! };
    this.viewMode = 'default';
  }

  onSubmit(): void {
    if (this.selectedImageFile) {
      const data = new FormData();
      data.append('file', this.selectedImageFile);
      this.as.updateProfileImg(data).then((url) => {
        // this.modelToEdit.imgUrl = url;
      }).catch((error) => {
        console.error('Error updating profile image:', error);
      });
    }

    // if (this.newPreference.gameId != 0 && this.newPreference.knowledgeId != 0) {
    //   this.PostPreference();
    // }

    // this.prefService.toAddPreference
    // for (const preference of this.prefService.toAddPreference) {
    //   this.prefService.post(preference).then(res => {
    //     this.modelToEdit!.preferences?.push(res as preferenceModel);
    //     this.deepCopy?.preferences?.push(res as preferenceModel);
    //     // this.viewMode = 'default';
    //     // this.gn.confirmMessage = "Preference created successfully";
    //     this.gn.setConfirm();
    //   }).catch(error => {
    //     console.error(error);
    //     this.gn.errorMessage = "Error creating preference";
    //     this.gn.setError();
    //   });
    // }

    //this.modelToEdit.birthDate = new Date(this.formattedBirthdate);
    this.modelToEdit!.birthDate = new Date(this.formattedBirthdate);

    let patch = createPatch(this.deepCopy, this.modelToEdit);

    console.log(new Date(this.modelToEdit!.birthDate.getTime() - 3600000).toISOString(), new Date(this.originalModel!.birthDate!).toISOString());
    if (new Date(this.modelToEdit!.birthDate.getTime() - 3600000).toISOString() === new Date(this.originalModel!.birthDate!).toISOString()) {
      patch = patch.filter(p => p.path !== '/birthDate');
    }

    if (patch.length !== 0) {
      this.as.patchUser(this.deepCopy!, patch).then((res) => {
        this.viewMode = 'default';
        this.modelToEdit = this.as.user?.value!;
        this.gn.confirmMessage = "User updated successfully";
        this.gn.setConfirm();
      }).catch((error) => {
        this.gn.errorMessage = "User could not be updated";
        this.gn.setError();
      });
    }
    else{
      this.gn.confirmMessage = "No changes detected";
      this.gn.setConfirm();
    }
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

      console.log(this.selectedImagePreview)
    }
  }

  deletePreference(preference: preferenceModel) {
    preference.isDeleted = true;
    this.modelToEdit!.preferences = this.modelToEdit!.preferences?.filter(p => p !== preference);
  }

  backHome(){
    this.router.navigate(['/home']);
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
  getUserGames() {
    const userGames = this.modelToEdit!.preferences?.map(pref => pref.gameId);
    return this.games.filter(g => userGames?.includes(g.gameId ?? 0));
  }
  //#endregion
};


