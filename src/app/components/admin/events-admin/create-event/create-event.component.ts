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
import { ReservationService } from '../../../../services/reservation.service';
import { EventInputModel } from '../../../../models/input-models/event.input.model';
import { AuthService } from '../../../../services/auth.service';
import { ReservationInputDTO } from '../../../../models/input-models/reservationInputDTO.model';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {

  constructor(private eventService: EventService, public ds: DashboardService, public gn: GeneralService, private router: Router, private sessionService: SessionService, private resService: ReservationService,private auth: AuthService) { }

  event: EventModel = {
    eventId: 0,
    name: '',
    description: '',
    isPublic: false,
    imgUrl: '',
    sessions: [],
    isDeleted: false,
    adminId: 0
  };

  @ViewChild('dropdownElementMaster') dropdownElementMaster: ElementRef | undefined;
  @ViewChild('dropdownElementGame') dropdownElementGame: ElementRef | undefined;
  @ViewChild('dropdownElementReservation') dropdownElementReservation: ElementRef | undefined;

  newSession: gameSessionModel = {
    sessionId: 0,
    gameId: 0,
    startDate: '',
    endDate: '',
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

  gameMasters: User[] = [];

  games: GameModel[] = [];

  users: User[] = [];

  filteredGameMasters: User[] = [...this.gameMasters];
  filteredGames: GameModel[] = [...this.games];
  filteredUsers: User[] = [...this.users];

  isLoading: boolean = false;

  ngOnInit(): void {
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
      sessionId: this.arrayAddedSessions.length + 1,
      gameId: 0,
      startDate: '',
      endDate: '',
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
    if (this.newSession.startDate === '' || this.newSession.endDate === '' || this.newSession.gameId === 0) {
      this.gn.errorMessage = 'Please fill all the fields';
      this.gn.setError();
      return;
    } else if (!this.isSameDay(new Date(this.newSession.startDate), new Date(this.newSession.endDate))) {
      this.gn.errorMessage = 'Start Date and End Date must be on the same day';
      this.gn.setError();
      return;
    } else {
      this.gn.confirmMessage = 'Session added';
      this.gn.setConfirm();
    }

    this.newSession.eventId = this.event.eventId;
    this.arrayAddedSessions.push(this.newSession);
    this.event.sessions!.push(this.newSession);
    this.newSession = {
      sessionId: this.arrayAddedSessions.length + 1,
      gameId: 0,
      startDate: '',
      endDate: '',
      masterId: '',
      seats: 6,
      eventId: this.event.eventId,
      isDeleted: false,
      reservations: []
    };
    this.closeAddModal();
  }

  isSameDay(startDate: Date, endDate: Date): boolean {
    return startDate.getDate() === endDate.getDate() && startDate.getMonth() === endDate.getMonth();
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
    if (this.sessionEdit.master) {
      this.gameMasterSearch = this.sessionEdit!.master!.name ? `${this.sessionEdit!.master!.name} ${this.sessionEdit!.master!.surname}` : '';
    } else {
      this.gameMasterSearch = '';
    }
    this.sessionEditStartDate = this.formatDate(new Date(this.sessionEdit.startDate));
    this.sessionEditEndDate = this.formatDate(new Date(this.sessionEdit.endDate));
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

    this.isEditSessionModal = false;
    this.gn.isOverlayOn$.next(false);
  }

  openDeleteSession(sessionId: number) {
    this.sessionId = sessionId;
    this.isDeleteModalSession = true;
    this.gn.isOverlayOn$.next(true);
  }

  toggleReservation(user: User) {
    const index = this.newSession.reservations.findIndex(reservation => reservation.userId === user.id);
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

  Cancel(){
    this.router.navigate(['/dashboard-admin/events']);
  }

  async saveChanges() {
    this.gn.isLoadingScreen$.next(true);
    this.isLoading = true;

    if(this.formData==undefined){
      this.gn.errorMessage = 'Please upload an image';
      this.gn.setError();
      this.gn.isLoadingScreen$.next(false);
      this.isLoading = false;
      throw new Error('Please upload an image');
    }

    // Create new event
    const eventInput: EventInputModel = {
      name: this.event.name,
      description: this.event.description,
      isPublic: this.event.isPublic,
      image: (this.formData!.get('file') as File) ,
      adminId: this.auth.getUserId() ?? ''
    };
    await this.eventService.post(eventInput).then((res) => {
      this.event.eventId = res.eventId;

      // Create new sessions
      const reservationsToCreate : Array<ReservationInputDTO> = [];
      for (const session of this.arrayAddedSessions) {
        const transformedSession = {
          StartDate: new Date(session.startDate),
          EndDate: new Date(session.endDate),
          Seats: session.seats,
          MasterId: session.masterId ? session.masterId : null,
          EventId: this.event.eventId,
          GameId: session.gameId
        };
        this.sessionService.addSessionNoNoti(transformedSession).then((res) => {
          session.sessionId = res.sessionId;
          if (session.reservations.length > 0) {
          session.reservations.forEach(reservation => {
          reservationsToCreate.push({ sessionId: session.sessionId, userId: reservation.userId });
        });
          }
        }).catch((err) => {
          console.error('Failed to create session:', err);
          this.gn.errorMessage = 'Failed to create session';
          this.gn.setError();
          this.gn.isLoadingScreen$.next(false);
          this.isLoading = false;
          throw new Error('Failed to create session');
        });
      }

      if (reservationsToCreate.length > 0) {
        this.resService.createMultipleReservation(reservationsToCreate).then(() => {
          console.log('Reservations created successfully');
        }).catch((err) => {
          console.error('Failed to create reservations:', err);
          this.gn.errorMessage = 'Failed to create reservations';
          this.gn.setError();
          this.gn.isLoadingScreen$.next(false);
          this.isLoading = false;
          throw new Error('Failed to create reservations');
        });
      }

      // if (this.formData) {
      //   this.eventService.updateEventImage(this.event.eventId, this.formData).then((res) => {
      //     this.event.imgUrl = res.imgUrl;
      //   }).catch((err) => {
      //     console.error('Failed to update event image:', err);
      //     this.gn.errorMessage = 'Failed to update event image';
      //     this.gn.setError();
      //     this.gn.isLoadingScreen$.next(false);
      //     this.isLoading = false;
      //     throw new Error('Failed to update event image');
      //   });
      // }

      this.gn.isLoadingScreen$.next(false);
      this.isLoading = false;
      this.gn.confirmMessage = 'Event created successfully';
      this.gn.setConfirm();
      this.router.navigate(['/dashboard-admin/events']);
    }).catch((err) => {
      console.error('Failed to create event:', err);
      this.gn.errorMessage = 'Failed to create event';
      this.gn.setError();
      this.gn.isLoadingScreen$.next(false);
      this.isLoading = false;
    });
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
    }
  }

  navigateEvents() {
    this.router.navigate(['/dashboard-admin/events']);
  }
}