import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { AuthService } from '../../services/auth.service';
import { gameSessionModel } from '../../models/gameSession.model';
import { GeneralService } from '../../services/general.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-registration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-registration.component.html',
  styleUrl: './confirm-registration.component.scss'
})
export class ConfirmRegistrationComponent implements OnInit{

  constructor(private sessionService: SessionService,public gn: GeneralService,private router: Router ) { }

  sessionDetail: any | undefined;
  confirmedReservationsCount: number = 0;
  isLoading : boolean = false;

  sessionId: string | null = null;
  userId: string | null = null;
  token: string | null = null;

  async ngOnInit(): Promise<void> {
    this.isLoading=true;
    this.gn.isLoadingScreen$.next(true);
    const urlParams = new URLSearchParams(window.location.search);
     this.sessionId = urlParams.get('sessionId');
     this.userId = urlParams.get('userId');
     this.token = urlParams.get('token');

    if(this.sessionId === null || this.userId === null || this.token === null){
      this.router.navigate(['home']);
    }

    if (this.sessionId !== null) {
      await this.sessionService.getSessionById(Number(this.sessionId)).then((session) => {
        this.sessionDetail = session;
      })
      .catch((error) => {
        console.error('Error loading session:', error);
      });;
    }

   

  if (this.sessionDetail && this.sessionDetail.reservations) {
    this.confirmedReservationsCount = this.sessionDetail.reservations.filter((res: { isConfirmed: any; }) => res.isConfirmed).length;
  }

  this.gn.isLoadingScreen$.next(false);
  this.isLoading=false;

}

async onConfirm() {
  this.gn.isLoadingScreen$.next(true);
  this.isLoading=true;
  if (this.userId !== null && this.token !== null && this.sessionId !== null) {
    await this.sessionService.confirmRegistration(Number(this.sessionId), this.userId, this.token).then(() => {
      this.gn.isLoadingScreen$.next(false);
      this.isLoading=false;
    })
    .catch((error) => {
      if (error.status === 500 && error.message.includes("Invalid token")) {
        this.sessionService.newConfirm(Number(this.sessionId!),this.userId!).then(() => {
          this.isLoading=false;
          this.gn.isLoadingScreen$.next(false);
        });
      }
      this.isLoading=false;
      this.gn.isLoadingScreen$.next(false);
      this.router.navigate(['home']);
    });
}

}





}
