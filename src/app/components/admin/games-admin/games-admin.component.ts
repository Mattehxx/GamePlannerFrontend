import { Component, ViewChild } from '@angular/core';
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
    FormsModule],
  templateUrl: './games-admin.component.html',
  styleUrl: './games-admin.component.scss'
})

export class GamesAdminComponent {

  editStates: { [key: string]: EditState } = {
    name: { isEditMode: false, editToggle: false },
    description: { isEditMode: false, editToggle: false },
    imgUrl: { isEditMode: false, editToggle: false },
  };

  showElement: boolean = false;
  hovered: boolean = false;
  editToggle: boolean = false;
  isEditMode: boolean = false;

  imgHover: boolean = false;

  form: FormGroup;

  selectedImage: string | null = null;

  // hoveredNameProperty: { element: GameModel; key: string } | null = null;

  // isEditingProperty: { element: any; key: string } | null = null;


  constructor(public ds: DashboardService, public headerService: HeaderService, public as: AdminService, private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      imgUrl: [null] 
    });
  }

  selectedGame: GameModel | undefined;

  displayedColumns: string[] = ['imgUrl', 'name', 'isDisabled'];
  dataSource = new MatTableDataSource<GameModel>([
    {
      name: "Dungeons & Dragons",
      description: "Un gioco di ruolo fantasy dove i giocatori creano personaggi e affrontano avventure in un mondo immaginario.",
      imgUrl: 'assets/images/mockup-img/games/DnD.jpg',
      isDisabled: false,
      isDeleted: false,
    },
    {
      name: "Gloomhaven",
      description: "Un gioco di ruolo tattico dove i giocatori affrontano dungeon e sviluppano i loro personaggi in una campagna persistente.",
      imgUrl: 'assets/images/mockup-img/games/gloomhaven.jpeg',
      isDisabled: false,
      isDeleted: false,
    },
    {
      name: "Descent: Journeys in the Dark",
      description: "Un gioco di avventura dungeon crawler, dove un giocatore controlla i nemici e gli altri collaborano per completare missioni.",
      imgUrl: 'assets/images/mockup-img/games/Descent.jpeg',
      isDisabled: false,
      isDeleted: false,
    },
    {
      name: "Mice and Mystics",
      description: "Un gioco narrativo cooperativo dove i giocatori interpretano topi guerrieri in un castello infestato.",
      imgUrl: 'assets/images/mockup-img/games/grail.jpg',
      isDisabled: true,
      isDeleted: false,
    },
    {
      name: "The Witcher: Old World",
      description: "Un gioco di avventura e ruolo ambientato nel mondo di The Witcher, dove i giocatori esplorano e affrontano mostri.",
      imgUrl: 'assets/images/mockup-img/games/miceMystic.jpg',
      isDisabled: false,
      isDeleted: false,
    },
    {
      name: "Tainted Grail: The Fall of Avalon",
      description: "Un gioco narrativo e di esplorazione ambientato in un mondo oscuro ispirato alla leggenda di Re Artù.",
      imgUrl: 'assets/images/mockup-img/games/theWitcher.jpeg',
      isDisabled: false,
      isDeleted: false,
    },
  ]


  );
  @ViewChild(MatPaginator) paginator!: MatPaginator;




  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openCreateOrUpdateGamesModal(game: GameModel | undefined) {
    this.as.isGameDetail = true;
    this.selectedGame = game;
  }

  closeModal() {
    this.as.isGameDetail = false;
    this.isEditMode = false;
  }

  ableOrDisableGame() {
    this.selectedGame!.isDisabled = !this.selectedGame?.isDisabled;
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

    // this.isEditingProperty = { element, key };

    this.editStates[key].isEditMode = true;
    this.editStates[key].editToggle = false;

    this.form.patchValue({
      [key]: element[key]
    });

    if (!this.form.contains(key)) {
      this.form.addControl(key, this.fb.control(element[key]));
    }
  }

  saveProperty(element: any, key: string): void {
    const control = this.form.get(key);

    if (control !== null && control instanceof FormControl) {
      element[key] = control.value;
    }
    this.disableEdit(key);
  }

  disableEdit(key: string): void {
    this.editStates[key].isEditMode = false;
    this.form.setValue({
      name: this.selectedGame?.name,
      description: this.selectedGame?.description,
      imgUrl: this.selectedGame?.imgUrl
    });
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

      // Verifica che il file sia un'immagine
      if (!file.type.startsWith('image/')) {
        console.error('Il file selezionato non è un\'immagine.');
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        this.selectedImage = reader.result as string; // Salva l'anteprima
        this.form.patchValue({ image: file }); // Aggiungi il file al form
      };

      reader.onerror = () => {
        console.error('Errore durante la lettura del file.');
      };

      reader.readAsDataURL(file); // Converte l'immagine in base64
    }
  }

  saveImage(): void {
    if (this.selectedImage) {
      console.log('Immagine salvata:', this.selectedImage);
      // Implementa la logica per salvare l'immagine (esempio: invio al backend)
    }
  }

  cancelImage(): void {
    this.selectedImage = null; // Resetta l'anteprima
    this.form.reset(); // Resetta il form
  }

}
