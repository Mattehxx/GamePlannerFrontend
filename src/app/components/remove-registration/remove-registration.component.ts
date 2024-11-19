import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { GeneralService } from '../../services/general.service';
import { reservationModel } from '../../models/reservation.model';

@Component({
  selector: 'app-remove-registration',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './remove-registration.component.html',
  styleUrl: './remove-registration.component.scss'
})
export class RemoveRegistrationComponent {

  constructor(private router: Router,private sessionService: SessionService,private gn: GeneralService) { }
  isLoading : boolean = true;
  reservationDetail: reservationModel | undefined;
  token: string | null = null;
  reservationId: string | null = null;

  async ngOnInit(): Promise<void> {
    this.gn.isLoadingScreen$.next(true);
    const urlParams = new URLSearchParams(window.location.search);
    this.reservationId = urlParams.get('reservationId'); 'https://localhost:7015/api/delete?reservationId=13&token=18cddeba-76a1-41db-b7e9-da09ac0150c0'
    this.token = urlParams.get('token');

    if(this.reservationId === null || this.token === null){
      this.router.navigate(['home']);
    }

    if (this.reservationId !== null) {
      await this.sessionService.getReservationById(Number(this.reservationId)).then((session) => {
        this.reservationDetail = session;
        this.gn.isLoadingScreen$.next(false);
      })
      .catch((error) => {
        console.error('Error loading session:', error);
      });;
    }

  }

  async onCancel() {
    if (this.token !== null) {
      await this.sessionService.removeRegistration(Number(this.reservationId), this.token).then(() => {
        this.gn.isLoadingScreen$.next(false);
        this.isLoading=false;
        //avviso di cancellazione
        this.router.navigate(['home']);
      })
      .catch((error) => {
        console.error('Error confirming reservation:', error);
      });
  }
  }

  onKeep() {
    this.router.navigate(['home']);
  }
}
