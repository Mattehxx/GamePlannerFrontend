import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from '../../../models/user.model';
import { GeneralService } from '../../../services/general.service';
import { HeaderService } from '../../../services/header.service';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { ModalCreateUserComponent } from '../users-admin/modal-create-user/modal-create-user.component';
import { GameModel } from '../../../models/game.model';
import { NavigationEnd, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GameService } from '../../../services/game.service';
import { Subject, takeUntil } from 'rxjs';
import { ModalCreateGameComponent } from "./modal-create-game/modal-create-game.component";
import { createPatch } from 'rfc6902';



interface EditState {
  isEditMode: boolean;
  editToggle: boolean;
};
@Component({
  selector: 'app-games-admin',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatPaginator,
    ModalCreateUserComponent,
    ReactiveFormsModule,
    FormsModule, ModalCreateGameComponent],
  templateUrl: './games-admin.component.html',
  styleUrl: './games-admin.component.scss'
})

export class GamesAdminComponent implements OnInit, OnDestroy {



  editStates: { [key: string]: EditState } = {
    name: { isEditMode: false, editToggle: false },
    description: { isEditMode: false, editToggle: false },
    imgUrl: { isEditMode: false, editToggle: false },
  };

  showElement: boolean = false;
  hovered: boolean = false;
  editToggle: boolean = false;
  isEditMode: boolean = false;

  death$ = new Subject<void>();

  imgHover: boolean = false;

  form: FormGroup;

  selectedImage: string | null = null;


  selectedImagePreview: string | null = null;
  selectedImageFile: File | null = null;


  constructor(public ds: DashboardService, public headerService: HeaderService, public as: AdminService, private router: Router, private fb: FormBuilder, public gs: GameService, private gn: GeneralService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      imgUrl: [null]
    });
  }

  selectedGame: GameModel | undefined;

  displayedColumns: string[] = ['imgUrl', 'name', 'isDisabled'];
  dataSource = new MatTableDataSource<GameModel>([])

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.gs.Games$.pipe(takeUntil(this.death$)).subscribe({
      next: (games) => {
        this.dataSource.data = games;
        console.log(games);
      }
    })
    this.gs.getGames();

  }

  ngOnDestroy(): void {
    this.death$.next();
    this.death$.complete();
  }



  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openCreateGameModal() {
    this.as.isCreateGameModal = true;
    this.gn.isOverlayOn$.next(true);
  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openGameDetailsModal(game: GameModel) {
    this.as.showGameDetail = true;
    this.gs.getDetails(game.gameId!);
    this.gs.gameDetail = game!;
  }

  closeModal() {

    this.isEditMode = false;

    if (this.editStates['imgUrl'].isEditMode && this.as.showGameDetail) {
      this.editStates['imgUrl'].isEditMode = false
    }
    else {

      this.as.showGameDetail = false;
    }
  }

  EnableOrDisableGame() {

    if (this.gs.gameDetail) {


      const modifiedObject: GameModel = { ...this.gs.gameDetail, isDisabled: !this.gs.gameDetail!.isDisabled };
      let patch = createPatch(this.gs.gameDetail, modifiedObject);

      console.log('Patch:', patch,);
      this.gs.patch(this.gs.gameDetail!, patch).then((res) => {
        this.gs.gameDetail!.isDisabled = !this.gs.gameDetail!.isDisabled;;
      })
        .catch((err) => {
          console.error('Failed to Update Game Status:', err);
        });

    }




  }

  toggleDeleteGameModal() {
    this.as.isDeleteGameModal = !this.as.isDeleteGameModal;
  }

  onMouseEnter(key: string): void {
    this.editStates[key].editToggle = true;
  }

  onMouseLeave(key: string): void {
    this.editStates[key].editToggle = false;
  }


  enableEdit(element: any, key: string): void {
    console.log('Value passed:', element);

    this.editStates[key].isEditMode = true;
    this.editStates[key].editToggle = false;

    this.form.patchValue({
      [key]: element[key]
    });


    console.log(this.form.value);

    if (!this.form.contains(key)) {
      this.form.addControl(key, this.fb.control(element[key]));
    }
  }

  saveProperty(element: any, key: string): void {
    const control = this.form.get(key);

    if (control !== null && control instanceof FormControl) {
      element = { ...element, [key]: control.value };
    }
    // console.log(this.gs.gameDetail, element);

    let patch = createPatch(this.gs.gameDetail, element);
    console.log(patch)

    this.gs.patch(this.gs.gameDetail!, patch).then((res) => {
      this.gs.gameDetail = { ...element, [key]: control!.value };
    })
      .finally(() => {
        this.disableEdit(key);
      })

  }

  disableEdit(key: string): void {
    this.editStates[key].isEditMode = false;

  }

  cancelEdit(key: string): void {
    this.editStates[key].isEditMode = false;
    this.editStates[key].editToggle = true;
    this.disableEdit(key);
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

  saveImage(): void {
    if (this.selectedImageFile) {

      console.log('Image saved:', this.selectedImageFile);
    } else {
      console.warn('No image selected.');
    }

    if (this.selectedImageFile && this.gs.gameDetail?.imgUrl) {

      this.gs.put(this.gs.gameDetail, this.selectedImageFile).then((res) => {
        console.log('Image updated successfully:', res);
        this.form.patchValue({ imgUrl: this.selectedImageFile });
        this.gs.getDetails(this.gs.gameDetail!.gameId!);
        this.cancelImage();
        this.cancelEdit('imgUrl');
        // this.selectedGame = this.gs.gameDetail;
      })
        .catch((err) => {
          console.error('Error updating image:', err);
        });

    } else {
      console.error('Image file not selected.');
    }



  }

  cancelImage(): void {
    this.selectedImagePreview = null;
    this.form.reset();
  }

  delete() {
   this.gs.delete(this.gs.gameDetail!.gameId!).then((res) => {
    this.toggleDeleteGameModal();
     this.as.showGameDetail = false;
     this.gs.getGames();
   });
  }

}
