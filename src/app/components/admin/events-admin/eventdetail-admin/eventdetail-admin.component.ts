import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventModel } from '../../../../models/event.model';
import { GameModel } from '../../../../models/game.model';
import { gameSessionModel } from '../../../../models/gameSession.model';
import { reservationModel } from '../../../../models/reservation.model';
import { User } from '../../../../models/user.model';
import { DashboardService } from '../../../../services/dashboard.service';
import { EventService } from '../../../../services/event.service';
import { GeneralService } from '../../../../services/general.service';
import { SessionService } from '../../../../services/session.service';

@Component({
  selector: 'app-eventdetail-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eventdetail-admin.component.html',
  styleUrls: ['./eventdetail-admin.component.scss']
})
export class EventDetailAdminComponent implements OnInit {

  constructor(private eventService: EventService, public ds: DashboardService, public gn: GeneralService, private router: Router,private sessionService: SessionService) { }

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

  arrayAddedSessions: gameSessionModel[] = [];

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

  ngOnInit(): void {
    if (this.eventService.eventDetail === undefined) {
      this.router.navigate(['/dashboard-admin/events']);
    } else {
      this.eventService.getEventsId(this.eventService.eventDetail.eventId).then((event) => {
        this.event=event;
        this.newSession.eventId = this.event.eventId;
      });
    }

  }

  openAddModal() {
    this.isAddSessionModal = true;
    this.gn.isOverlayOn$.next(true);
  }

  closeAddModal() {
    this.isAddSessionModal = false;
    this.gn.isOverlayOn$.next(false);
    this.newSession = {
      sessionId: this.addSession.length + 1,
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
    this.arrayAddedSessions.push(this.newSession);
    this.event?.sessions?.push(this.newSession);
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
    //  this.sessionService.addSession(this.newSession).then((session) => {
    //   this.event?.sessions?.push(session);
    //  });

     this.closeAddModal();
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
    if(this.sessionEdit.game){
      this.gameSearch = this.sessionEdit.game.name;
    }
    else{
      this.gameSearch = '';
    }
    console.log(this.sessionEdit.reservations);
    this.gameMasterSearch = this.sessionEdit!.master!.name ? `${this.sessionEdit!.master!.name} ${this.sessionEdit!.master!.surname}` : '';
    this.sessionEditStartDate = this.formatDate(this.sessionEdit.startDate);
    this.sessionEditEndDate = this.formatDate(this.sessionEdit.endDate);
    this.isEditSessionModal = true;
    this.gn.isOverlayOn$.next(true);
  }

  editSession() {
    if (this.sessionEdit) {
      this.sessionEdit.startDate = this.parseDate(this.sessionEditStartDate);
      this.sessionEdit.endDate = this.parseDate(this.sessionEditEndDate);
    }
    if(this.arrayAddedSessions.some(session => session.sessionId === this.sessionEdit!.sessionId)){
      const index = this.arrayAddedSessions.findIndex(session => session.sessionId === this.sessionEdit!.sessionId);
      this.arrayAddedSessions[index] = this.sessionEdit!;
    }

    if(this.event?.sessions?.some(session => session.sessionId === this.sessionEdit!.sessionId)){
      const index = this.event.sessions.findIndex(session => session.sessionId === this.sessionEdit!.sessionId);
      this.event.sessions[index] = this.sessionEdit!;
    }

    console.log(this.event)
    this.isEditSessionModal = false;
    this.gn.isOverlayOn$.next(false);
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
    this.event!.sessions = this.event!.sessions!.filter(session => session.sessionId !== this.sessionId);
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
    this.gn.isLoadingScreen$.next(true);
    setTimeout(() => {
      this.gn.isLoadingScreen$.next(false);
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