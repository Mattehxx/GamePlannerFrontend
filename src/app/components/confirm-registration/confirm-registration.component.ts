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
  isLoading : boolean = true;

  async ngOnInit(): Promise<void> {
    this.gn.isLoadingScreen$.next(true);
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('sessionId');
    const userId = urlParams.get('userId');
    const token = urlParams.get('token');

    if(sessionId === null || userId === null || token === null){
      this.router.navigate(['home']);
    }

    console.log(sessionId, userId, token);

    if (sessionId !== null) {
      await this.sessionService.getSessionById(Number(sessionId)).then((session) => {
        this.sessionDetail = session;
        console.log(this.sessionDetail)
      })
      .catch((error) => {
        console.error('Error loading session:', error);
      });;
    }

    if (userId !== null && token !== null) {
      await this.sessionService.confirmRegistration(Number(sessionId), userId, token).then(() => {
        this.gn.isLoadingScreen$.next(false);
        this.isLoading=false;
      })
      .catch((error) => {
        console.error('Error confirming reservation:', error);
      });
  }

  if (this.sessionDetail && this.sessionDetail.reservations) {
    this.confirmedReservationsCount = this.sessionDetail.reservations.filter((res: { isConfirmed: any; }) => res.isConfirmed).length;
  }

}

}
