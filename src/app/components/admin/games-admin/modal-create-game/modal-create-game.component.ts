import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../../services/admin.service';
import { GeneralService } from '../../../../services/general.service';
import { CommonModule } from '@angular/common';
import { GameModel } from '../../../../models/game.model';
import { GameService } from '../../../../services/game.service';

@Component({
  selector: 'app-modal-create-game',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-create-game.component.html',
  styleUrl: './modal-create-game.component.scss'
})
export class ModalCreateGameComponent {

  newGame: GameModel = {
    gameId: 0,
    name: '',
    description: '',
    imgUrl: '',
    isDeleted: false,
    isDisabled: false
  };

  selectedImagePreview: string | null = null;
  selectedImageFile: File | null = null;

  gameForm: FormGroup;
  constructor(public as: AdminService, private formBuilder: FormBuilder, private router: Router, private gn: GeneralService, private gs: GameService) {


    this.gameForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imgUrl: ['', [Validators.required]]
    });

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
  cancelImage() {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    this.createGame();
  }

  createGame() {
    const formData = new FormData();
    formData.append('ImgUrl', this.selectedImageFile!);
    formData.append('Name', this.gameForm.value.name!);
    formData.append('Description', this.gameForm.value.description!);


    this.gs.create(formData).subscribe({
      next: (res) => {
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  closeModal() {
    this.gn.isOverlayOn$.next(false);
    this.as.isCreateGameModal = false;
  }

}
