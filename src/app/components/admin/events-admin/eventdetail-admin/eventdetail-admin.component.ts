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

  constructor(private eventService: EventService, public ds: DashboardService, public gn: GeneralService, private router: Router, private sessionService: SessionService) { }

  event: EventModel | undefined;
  @ViewChild('dropdownElementMaster') dropdownElementMaster: ElementRef | undefined;
  @ViewChild('dropdownElementGame') dropdownElementGame: ElementRef | undefined;
  @ViewChild('dropdownElementReservation') dropdownElementReservation: ElementRef | undefined;

  newSession: gameSessionModel = {
    sessionId: 0,
    gameId: 0,
    startDate: new Date(),
    endDate: new Date(),
    masterId: '',
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
  selectedGame: GameModel | undefined;
  reservationSearch = '';

  arrayAddedSessions: gameSessionModel[] = [];

  formData: FormData | undefined;
  imageUrl: string | ArrayBuffer | null = null;

  gameMasters: User[] = [
    { id: '1', name: 'John', surname: 'Doe', role: 'Game Master' },
    { id: '2', name: 'Jane', surname: 'Smith', role: 'Game Master' },
    { id: '3', name: 'Alice', surname: 'Johnson', role: 'Game Master' }
  ];

  games: GameModel[] = [];

  users: User[] = [];

  filteredGameMasters: User[] = [...this.gameMasters];
  filteredGames: GameModel[] = [...this.games];
  filteredUsers: User[] = [...this.users];

  isLoading: boolean = false;

  ngOnInit(): void {
    if (this.eventService.eventDetail === undefined) {
      this.router.navigate(['/dashboard-admin/events']);
    } else {
      this.gn.isLoadingScreen$.next(true);
      this.isLoading = true;
      this.eventService.getEventsId(this.eventService.eventDetail.eventId).then((event) => {
        this.event = event;
        this.newSession.eventId = this.event.eventId;
        this.gn.isLoadingScreen$.next(false);
        this.isLoading = false;
        console.log(this.event);
      });
    }
    this.eventService.getGames().subscribe({
      next: (res) => {
        this.games = res.value;
        this.filteredGames = res.value;
      }
    });
  }

  openAddModal() {
    this.gameMasterSearch = '';
    this.gameSearch = '';
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
      masterId: '',
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
    console.log(this.newSession);
    const isValidDateFormat = (date: string) => {
      const isoFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/;
      return isoFormat.test(date);
    };
    console.log(isValidDateFormat(this.newSession.startDate.toString()))
    if(!isValidDateFormat(this.newSession.startDate.toString()) || !isValidDateFormat(this.newSession.endDate.toString()) || this.newSession.gameId === 0 ) {
      this.gn.errorMessage='Please fill all the fields';
      this.gn.setError();
      return;
    }

    this.newSession.eventId = this.event?.eventId!;
    this.arrayAddedSessions.push(this.newSession);
    this.event?.sessions?.push(this.newSession);
    this.newSession = {
      sessionId: this.arrayAddedSessions.length + 1,
      gameId: 0,
      startDate: new Date(),
      endDate: new Date(),
      masterId: '',
      seats: 6,
      eventId: this.event?.eventId!,
      isDeleted: false,
      reservations: []
    };
    console.log(this.event, this.arrayAddedSessions);
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
    this.eventService.getUsersContainsString(search).subscribe({
      next: (odata) => {
        this.users = odata.value;
        this.filteredUsers = this.users;
      }
    });
  }

  showOptions() {
    if (this.selectedGame) {
      this.eventService.getGameMasters(this.selectedGame!.gameId!).subscribe({
        next: (res) => {
          this.gameMasters = res.value;
          this.filteredGameMasters = res.value;
        }
      });
      this.isShowingMasterOptions = true;
    }
  }

  showOptionsEdit() {
    if (this.sessionEdit!.game) {
      this.eventService.getGameMasters(this.sessionEdit!.gameId).subscribe({
        next: (res) => {
          this.gameMasters = res.value;
          this.filteredGameMasters = res.value;
        }
      });
      this.isShowingMasterOptions = true;
    }
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
    if (this.selectedGame) {
      this.gameMasterSearch = '';
      this.newSession.masterId = '0';
      this.filterGameMasters();
    }
  }

  clearGameSearch() {
    this.gameSearch = '';
    this.newSession.gameId = 0;
    this.filterGames();
  }

  clearGameEditSearch() {
    this.gameSearch = '';
    this.sessionEdit!.gameId = 0;
    this.sessionEdit!.game = undefined;
    this.filterGames();
  }

  clearReservationSearch() {
    this.reservationSearch = '';
    this.filterUsers();
  }

  selectGameMaster(master: User) {
    this.newSession.masterId = master.id ? master.id : '';
    this.newSession.master = master;
    this.gameMasterSearch = `${master.name} ${master.surname}`;
    this.isShowingMasterOptions = false;
  }

  selectGame(game: GameModel) {
    this.newSession.gameId = game.gameId ? game.gameId : 0;
    this.newSession.game = game;
    this.gameSearch = `${game.name}`;
    this.selectedGame = game;
    this.isShowingGameOptions = false;
  }

  selectEditGame(game: GameModel) {
    this.sessionEdit!.gameId = game.gameId ? game.gameId : 0;
    this.sessionEdit!.game = game;
    this.gameSearch = `${game.name}`;
    this.isShowingGameOptions = false;
  }

  openEditSession(session: gameSessionModel) {
    this.sessionEdit = { ...session };
    if (this.sessionEdit.game) {
      this.gameSearch = this.sessionEdit.game.name;
    } else {
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

    if (this.arrayAddedSessions.some(session => session.sessionId === this.sessionEdit!.sessionId)) {
      const index = this.arrayAddedSessions.findIndex(session => session.sessionId === this.sessionEdit!.sessionId);
      this.arrayAddedSessions[index] = this.sessionEdit!;
    }

    if (this.event?.sessions?.some(session => session.sessionId === this.sessionEdit!.sessionId)) {
      const index = this.event.sessions.findIndex(session => session.sessionId === this.sessionEdit!.sessionId);
      this.event.sessions[index] = this.sessionEdit!;
    }

    console.log(this.event);
    this.isEditSessionModal = false;
    this.gn.isOverlayOn$.next(false);
  }

  openDeleteSession(sessionId: number) {
    this.sessionId = sessionId;
    this.isDeleteModalSession = true;
    this.gn.isOverlayOn$.next(true);
  }

  toggleReservation(user: User) {
    console.log(user);
    const index = this.newSession.reservations.findIndex(reservation => reservation.userId === user.id);
    console.log(index);
    if (index === -1) {
      this.newSession.reservations.push({ reservationId: 0, token: '', isConfirmed: false, isDeleted: false, sessionId: this.newSession.sessionId, userId: user.id! });
    } else {
      this.newSession.reservations.splice(index, 1);
    }
  }

  toggleReservationEdit(user: User) {
    const index = this.sessionEdit!.reservations.findIndex(reservation => reservation.userId === user.id);
    if (index === -1) {
      this.sessionEdit!.reservations.push({ reservationId: 0, token: '', isConfirmed: false, isDeleted: false, sessionId: this.sessionEdit!.sessionId, userId: user.id! });
    } else {
      this.sessionEdit!.reservations.splice(index, 1);
    }
  }

  removeReservation(user: User) {
    const index = this.newSession.reservations.findIndex(reservation => reservation.userId === user.id);
    if (index !== -1) {
      this.newSession.reservations.splice(index, 1);
    }
  }

  removeReservationEdit(reservation: reservationModel) {
    const index = this.sessionEdit!.reservations.findIndex(r => r.reservationId === reservation.reservationId);
    if (index !== -1) {
      this.sessionEdit!.reservations.splice(index, 1);
    }
  }

  isUserSelected(user: User): boolean {
    return this.newSession.reservations.some(reservation => reservation.userId === user.id);
  }

  isUserSelectedEdit(user: User): boolean {
    return this.sessionEdit!.reservations.some(reservation => reservation.userId === user.id);
  }

  get selectedUsers(): User[] {
    return this.users.filter(user => this.isUserSelected(user));
  }

  get selectedUsersEdit(): User[] {
    return this.users.filter(user => this.isUserSelectedEdit(user));
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
    this.arrayAddedSessions = this.arrayAddedSessions.filter(session => session.sessionId !== this.sessionId);
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

  uploadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      this.formData = formData;

      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);

      // this.http.post(`${environment.apiUrl}/upload`, formData).subscribe({
      //   next: (response) => {
      //     console.log('Upload successful:', response);
      //   },
      //   error: (error) => {
      //     console.error('Upload error:', error);
      //   }
      // });
    }
  }
}