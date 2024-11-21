import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventModel } from '../../models/event.model';
import { gameSessionModel } from '../../models/gameSession.model';
import { AuthService } from '../../services/auth.service';
import { GeneralService } from '../../services/general.service';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss'
})
export class EventDetailComponent implements OnInit{

  constructor(public gn: GeneralService,public auth: AuthService,private router: Router,private resService: ReservationService) { }

  event : EventModel | undefined;

  sessionDetail: gameSessionModel | undefined;
  isSessionDetail: boolean = false;

  userId: string | null = null;

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    if(this.gn.eventDetail == undefined){ 
      this.router.navigate(['events']);
    } else {
      const now = new Date().getTime();
      this.gn.eventDetail.sessions = this.gn.eventDetail.sessions?.filter(session => {
        return new Date(session.startDate!).getTime() > now;
      }).sort((a, b) => {
        return new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime();
      });
      // this.gn.eventDetail!.sessions!.forEach(session => {
      //   session.reservations = session.reservations.filter(reservation => reservation.isConfirmed);
      // }); 
    }

    this.event= this.gn.eventDetail;
  }

  register(session: gameSessionModel) {
    if (this.auth.isLogged) {
      // Mostra la modale di caricamento
      if(this.isSessionDetail){
        this.closeSessionDetail();
      }
      this.gn.isLoading = true;
        this.resService.createReservation(session.sessionId).then(() => {
          this.gn.isLoading = false;
          this.gn.isConfirmModal = true;
        }).catch(() => {
          this.gn.isLoading = false;
        });
      // Simula una chiamata con un ritardo di 2 secondi
      // setTimeout(() => {
      //   // Nasconde la modale di caricamento
      //   this.gn.isLoading = false;

      //   // Simula un risultato positivo e mostra la modale di conferma
      //   this.gn.isConfirmModal = true;

      //   // Nasconde la modale di conferma dopo 3 secondi
      //   // setTimeout(() => {
      //   //   this.gn.isConfirmModal = false;
      //   // }, 3000);
      // }, 1500);
    }
    else{
      this.gn.isSignModal = true;
    }
  }

  joinQueue(session: gameSessionModel) {
    if (this.auth.isLogged) {
      // Mostra la modale di caricamento
      if(this.isSessionDetail){
        this.closeSessionDetail();
      }
      this.gn.isLoading = true;
        this.resService.createReservation(session.sessionId).then(() => {
          this.gn.isLoading = false;
          this.gn.isConfirmModal = true;
        }).catch(() => {
          this.gn.isLoading = false;
        });
      // Simula una chiamata con un ritardo di 2 secondi
      // setTimeout(() => {
      //   // Nasconde la modale di caricamento
      //   this.gn.isLoading = false;

      //   // Simula un risultato positivo e mostra la modale di conferma
      //   this.gn.isConfirmModal = true;

      //   // Nasconde la modale di conferma dopo 3 secondi
      //   // setTimeout(() => {
      //   //   this.gn.isConfirmModal = false;
      //   // }, 3000);
      // }, 1500);
    }
    else{
      this.gn.isSignModal = true;
    }
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

  checkSessionReservation(session: gameSessionModel) {
    return session.reservations.some(reservation => reservation.userId === this.userId && !reservation.isDeleted);
  }

  checkQueueReservation(session: gameSessionModel) {
    return session.reservations.some(reservation => reservation.userId === this.userId && !reservation.isDeleted && !reservation.isConfirmed);
  }

  checkConfirmedReservation(session: gameSessionModel) {
    return session.reservations.some(reservation => reservation.userId === this.userId && reservation.isConfirmed && !reservation.isDeleted);
  }

  sessionModal(status: boolean) {
    if(status){
      this.gn.isSessionModal = true;
      this.gn.isOverlayOn$.next(true);
    }
    else{
      this.gn.isSessionModal = false;
      this.gn.isOverlayOn$.next(false);
    }
  }

}
