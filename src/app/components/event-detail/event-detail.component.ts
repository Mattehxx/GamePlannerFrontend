import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventModel } from '../../models/event.model';
import { gameSessionModel } from '../../models/gameSession.model';
import { reservationModel } from '../../models/reservation.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss'
})
export class EventDetailComponent implements OnInit{

  constructor(public gn: GeneralService,public auth: AuthService,private router: Router) { }

  event : EventModel | undefined;

  sessionDetail: gameSessionModel | undefined;
  isSessionDetail: boolean = false;

  admin: User = {
    userId: 'sfasf',
    name: 'Yassine',
    surname: 'admin',
    email: '',
    phoneNumber: '',
    birthDate: new Date('1995-01-01'),
    imgUrl: '',
    level: 1,
    isDeleted: false,
    role: 'User'
  }

  reservation: reservationModel = {
    reservationId: 1,
    token: '',
    isConfirmed: false,
    isDeleted: false,
    sessionId: 1,
    userId: '1',
  }

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
    reservations: [this.reservation]
  }


  ngOnInit() {
    if(this.gn.eventDetail == undefined){ //provvisorio
      this.event= {
        eventId: 4,
        name: 'The Wild Beyond the Witchlight',
        description: "Join us for an exciting adventure in the Feywild! In this campaign, we'll explore the whimsical and sometimes dangerous realm of the Feywild, encountering magical creatures, solving riddles, and unraveling the mysteries of the Wild Beyond the Witchlight.",
        isPublic: false,
        imgUrl: '/assets/images/wallpaper2.jpg',
        isDeleted: false,
        adminId: 204,
        gameSessions: [this.gameSession,this.gameSession,this.gameSession,this.gameSession,this.gameSession,this.gameSession]
      }
    }
    else
       this.event= this.gn.eventDetail;
  }

  register() {
    if (this.auth.isLogged) {
      // Mostra la modale di caricamento
      this.gn.isLoading = true;

      // Simula una chiamata con un ritardo di 2 secondi
      setTimeout(() => {
        // Nasconde la modale di caricamento
        this.gn.isLoading = false;

        // Simula un risultato positivo e mostra la modale di conferma
        this.gn.isConfirmModal = true;

        // Nasconde la modale di conferma dopo 3 secondi
        // setTimeout(() => {
        //   this.gn.isConfirmModal = false;
        // }, 3000);
      }, 1500);
    }
    else{
      this.gn.isSignModal = true;
    }
  }

  joinQueue() {

  }

  redirect(login: boolean) {
    this.gn.isSignModal = false;
    this.gn.eventRoute = this.router.url;
    if(login){
      this.router.navigate(['login']);
    }
    else{
      this.router.navigate(['register']);
    }
  }

  openSessionDetail(session: gameSessionModel) {
    if(this.gn.isSessionModal){
      this.gn.isSessionModal=false;
    }
    this.sessionDetail = session;
    this.isSessionDetail = true;
    this.gn.isOverlayOn$.next(true);
  }

  closeSessionDetail() {
    this.isSessionDetail = false;
    this.gn.isOverlayOn$.next(false);
    this.sessionDetail = undefined;
  }

}
