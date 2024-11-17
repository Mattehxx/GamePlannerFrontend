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
    ModalCreateUserComponent],
  templateUrl: './games-admin.component.html',
  styleUrl: './games-admin.component.scss'
})
export class GamesAdminComponent {

  imageObject = {
    backgroundUrl: ' /assets/images/mockup-img/games/background-img.jpg '
  };

  constructor(public ds: DashboardService, public headerService: HeaderService, public as: AdminService,private router:Router) { }

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
    }
}
