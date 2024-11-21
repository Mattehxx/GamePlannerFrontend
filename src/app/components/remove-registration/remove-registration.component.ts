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
  reservationId: string | null = null;

  async ngOnInit(): Promise<void> {
    this.gn.isLoadingScreen$.next(true);
    const urlParams = new URLSearchParams(window.location.search);
    this.reservationId = urlParams.get('reservationId');   

    if(this.reservationId === null){
      this.router.navigate(['home']);
    }

    if (this.reservationId !== null) {
      await this.sessionService.getReservationById(Number(this.reservationId)).then((session) => {
        this.reservationDetail = session;
        this.gn.isLoadingScreen$.next(false);
      })
      .catch((error) => {
        console.error('Error loading session:', error);
        this.gn.isLoadingScreen$.next(false);
      });;
    }

  }

  async onCancel() {
   
      await this.sessionService.removeRegistration(Number(this.reservationId)).then(() => {
        this.gn.isLoadingScreen$.next(false);
        this.isLoading=false;
        //avviso di cancellazione
        this.router.navigate(['home']);
      })
      .catch((error) => {
        console.error('Error confirming reservation:', error);
      });
  
  }

  onKeep() {
    this.router.navigate(['home']);
  }
}
