import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../../services/event.service';
import { EventModel } from '../../../../models/event.model';
import { gameSessionModel } from '../../../../models/gameSession.model';
import { reservationModel } from '../../../../models/reservation.model';
import { User } from '../../../../models/user.model';
import { GameModel } from '../../../../models/game.model';
import { DashboardService } from '../../../../services/dashboard.service';
import { GeneralService } from '../../../../services/general.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eventdetail-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eventdetail-admin.component.html',
  styleUrls: ['./eventdetail-admin.component.scss']
})
export class EventDetailAdminComponent implements OnInit {

  constructor(private eventService: EventService, public ds: DashboardService, public gn: GeneralService, private router: Router) { }

  event: EventModel | undefined;
  @ViewChild('dropdownElementMaster') dropdownElementMaster: ElementRef | undefined;
  @ViewChild('dropdownElementGame') dropdownElementGame: ElementRef | undefined;
  @ViewChild('dropdownElementReservation') dropdownElementReservation: ElementRef | undefined;

  newSession: gameSessionModel = {
    sessionId: 0,
    gameId: 0,
    startDate: new Date(),
    endDate: new Date(),
    masterId: '0',
    seats: 6,
    eventId: 0,
    isDeleted: false,
    reservations: []
  };

  isDeleteModalEvent: boolean = false;
  isDeleteModalSession: boolean = false;
  isAddSessionModal: boolean = false;
  isEditSessionModal: boolean = false;

  sessionId: number = 0;
  sessionEdit: gameSessionModel | undefined;
  sessionEditStartDate: string = '';
  sessionEditEndDate: string = '';

  isShowingMasterOptions: boolean = false;
  isShowingGameOptions: boolean = false;
  isShowingReservationOptions: boolean = false;

  gameMasterSearch = '';
  gameSearch = '';
  reservationSearch = '';

  gameMasters: User[] = [
    { userId: '1', name: 'John', surname: 'Doe', role: 'Game Master' },
    { userId: '2', name: 'Jane', surname: 'Smith', role: 'Game Master' },
    { userId: '3', name: 'Alice', surname: 'Johnson', role: 'Game Master' }
  ];

  games: GameModel[] = [
    {
      gameId: 101,
      name: 'D&D',
      description: 'Description for D&D',
      isDeleted: false,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDisabled: false
    },
    {
      gameId: 102,
      name: 'Bho',
      description: 'Description for D&D',
      isDeleted: false,
      imgUrl: '/assets/images/wallpaper2.jpg',
      isDisabled: false
    }
  ];

  users: User[] = [
    { userId: '1', name: 'John', surname: 'Doe', role: 'Player' },
    { userId: '2', name: 'Jane', surname: 'Smith', role: 'Player' },
    { userId: '3', name: 'Alice', surname: 'Johnson', role: 'Player' }
  ];

  filteredGameMasters: User[] = [...this.gameMasters];
  filteredGames: GameModel[] = [...this.games];
  filteredUsers: User[] = [...this.users];

  admin: User = {
    userId: 'sfasf',
    name: 'Yassine',
    surname: 'Char',
    email: '',
    phone: '',
    birthDate: new Date('1995-01-01'),
    imgUrl: '/assets/images/pfp.jpg',
    canBeMaster: true,
    level: 1,
    isDeleted: false,
    role: 'User'
  };

  reservation: reservationModel = {
    reservationId: 1,
    token: '',
    isConfirmed: false,
    isDeleted: false,
    sessionId: 1,
    userId: '1',
    user: this.admin // Assicurati che l'oggetto user esista
  };

  game: GameModel = {
    gameId: 101,
    name: 'D&D',
    description: 'Description for D&D',
    isDeleted: false,
    imgUrl: '/assets/images/wallpaper2.jpg',
    isDisabled: false
  };

  gameSession: gameSessionModel = {
    sessionId: 1,
    startDate: new Date('2023-11-01'),
    endDate: new Date('2023-11-02'),
    isDeleted: false,
    masterId: '301',
    eventId: 1,
    master: this.admin,
    seats: 4,
    gameId: 101,
    game: this.game,
    reservations: [this.reservation]
  };

  ngOnInit(): void {
    if (this.eventService.eventDetail === undefined) { //provvisorio
      this.event = {
        eventId: 1,
        name: 'D&D Adventure Night',
        description: 'Description for Event 1',
        isPublic: true,
        imgUrl: '/assets/images/wallpaper2.jpg',
        isDeleted: false,
        adminId: 201,
        admin: this.admin,
        gameSessions: [this.gameSession]
      };
    } else {
      this.event = this.eventService.eventDetail;
    }

    this.newSession.eventId = this.event.eventId;
  }

  openAddModal() {
    this.isAddSessionModal = true;
    this.gn.isOverlayOn$.next(true);
  }

  closeAddModal() {
    this.isAddSessionModal = false;
    this.gn.isOverlayOn$.next(false);
    this.newSession = {
      sessionId: 0,
      gameId: 0,
      startDate: new Date(),
      endDate: new Date(),
      masterId: '0',
      seats: 6,
      eventId: 0,
      isDeleted: false,
      reservations: []
    };
  }

  closeEditModal() {
    this.isEditSessionModal = false;
    this.gn.isOverlayOn$.next(false);
    this.sessionEdit = undefined;
  }

  addSession() {
    // this.eventService.addSession(this.gameSession);
  }

  filterGameMasters() {
    const search = this.gameMasterSearch.toLowerCase();
    this.filteredGameMasters = this.gameMasters.filter(master =>
      `${master.name} ${master.surname}`.toLowerCase().includes(search)
    );
  }

  filterGames() {
    const search = this.gameSearch.toLowerCase();
    this.filteredGames = this.games.filter(game =>
      `${game.name}`.toLowerCase().includes(search)
    );
  }

  filterUsers() {
    const search = this.reservationSearch.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      `${user.name} ${user.surname}`.toLowerCase().includes(search)
    );
  }

  showOptions() {
    this.isShowingMasterOptions = true;
  }

  showOptionsGame() {
    this.isShowingGameOptions = true;
  }

  showOptionsReservation() {
    this.isShowingReservationOptions = true;
  }

  toggleOptions() {
    this.isShowingMasterOptions = !this.isShowingMasterOptions;
  }

  clearMasterSearch() {
    this.gameMasterSearch = '';
    this.newSession.masterId = '0';
    this.filterGameMasters();
  }

  clearGameSearch() {
    this.gameSearch = '';
    this.newSession.gameId = 0;
    this.filterGames();
  }

  clearReservationSearch() {
    this.reservationSearch = '';
    this.filterUsers();
  }

  selectGameMaster(master: User) {
    this.newSession.masterId = master.userId ? master.userId : '';
    this.newSession.master = master;
    this.gameMasterSearch = `${master.name} ${master.surname}`;
    this.isShowingMasterOptions = false;
  }

  selectGame(game: GameModel) {
    this.newSession.gameId = game.gameId ? game.gameId : 0;
    this.newSession.game = game;
    this.gameSearch = `${game.name}`;
    this.isShowingGameOptions = false;
  }

  openEditSession(session: gameSessionModel) {
    this.sessionEdit = { ...session };
    this.gameSearch = this.sessionEdit!.game!.name ? this.sessionEdit!.game!.name : '';
    this.gameMasterSearch = this.sessionEdit!.master!.name ? `${this.sessionEdit!.master!.name} ${this.sessionEdit!.master!.surname}` : '';
    this.sessionEditStartDate = this.formatDate(this.sessionEdit.startDate);
    this.sessionEditEndDate = this.formatDate(this.sessionEdit.endDate);
    this.isEditSessionModal = true;
    this.gn.isOverlayOn$.next(true);
  }

  openDeleteSession(sessionId: number) {
    this.sessionId = sessionId;
    this.isDeleteModalSession = true;
    this.gn.isOverlayOn$.next(true);
  }

  toggleReservation(user: User) {
    const index = this.newSession.reservations.findIndex(reservation => reservation.userId === user.userId);
    if (index === -1) {
      this.newSession.reservations.push({ reservationId: 0, token: '', isConfirmed: false, isDeleted: false, sessionId: this.newSession.sessionId, userId: user.userId! });
    } else {
      this.newSession.reservations.splice(index, 1);
    }
  }

  removeReservation(user: User) {
    const index = this.newSession.reservations.findIndex(reservation => reservation.userId === user.userId);
    if (index !== -1) {
      this.newSession.reservations.splice(index, 1);
    }
  }

  removeReservationEdit(reservation: reservationModel) {
    const index = this.newSession.reservations.findIndex(reservation => reservation.reservationId === reservation.reservationId);
    if (index !== -1) {
      this.sessionEdit!.reservations.splice(index, 1);
    }
  }

  isUserSelected(user: User): boolean {
    return this.newSession.reservations.some(reservation => reservation.userId === user.userId);
  }

  get selectedUsers(): User[] {
    return this.users.filter(user => this.isUserSelected(user));
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.dropdownElementMaster && !this.dropdownElementMaster.nativeElement.contains(event.target)) {
      this.isShowingMasterOptions = false;
    }
    if (this.dropdownElementGame && !this.dropdownElementGame.nativeElement.contains(event.target)) {
      this.isShowingGameOptions = false;
    }
    if (this.dropdownElementReservation && !this.dropdownElementReservation.nativeElement.contains(event.target)) {
      this.isShowingReservationOptions = false;
    }
  }

  closeDeleteModal() {
    this.isDeleteModalSession = false;
    this.sessionId = 0;
    this.isDeleteModalEvent = false;
    this.gn.isOverlayOn$.next(false);
  }

  deleteEvent() {
    //chiamata api per cancellare evento
    this.isDeleteModalEvent = false;
    this.gn.isOverlayOn$.next(false);
  }

  deleteSession() {
    this.event!.gameSessions = this.event!.gameSessions!.filter(session => session.sessionId !== this.sessionId);
    this.isDeleteModalSession = false;
    this.sessionId = 0;
    this.gn.isOverlayOn$.next(false);
  }

  overlayOn() {
    this.isDeleteModalEvent = true;
    this.gn.isOverlayOn$.next(true);
  }

  saveChanges() {
    //chiamata api per salvare le modifiche
    //loading screen da usare nella chiamata api del servizio mentre si aspetta la risposta
    this.gn.isLOadingScreen$.next(true);
    setTimeout(() => {
      this.gn.isLOadingScreen$.next(false);
      this.router.navigate(['/dashboard-admin/events']);
    }, 1000);
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const hours = ('0' + d.getHours()).slice(-2);
    const minutes = ('0' + d.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  parseDate(dateString: string): Date {
    const [datePart, timePart] = dateString.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }

  onSubmit() {
    if (this.sessionEdit) {
      this.sessionEdit.startDate = this.parseDate(this.sessionEditStartDate);
      this.sessionEdit.endDate = this.parseDate(this.sessionEditEndDate);
      console.log('Formatted Start Date:', this.sessionEdit.startDate);
      console.log('Formatted End Date:', this.sessionEdit.endDate);
    }
  }
}