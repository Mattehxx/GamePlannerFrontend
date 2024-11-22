import { Injectable } from '@angular/core';
import { EventModel } from '../models/event.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { GeneralService } from './general.service';
import { ReservationInputDTO } from '../models/input-models/reservationInputDTO.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

    constructor(private http: HttpClient,private as: AuthService,private gn: GeneralService) { }

    
    createReservation(sessionId: number,userIdExt?: string){
        let userId = localStorage.getItem('userId');
        if(userIdExt){
            userId = userIdExt;
        }
        return new Promise((resolve, reject) => {
            this.http.post<any>(`${environment.apiUrl}api/Reservation`, {sessionId,userId}).subscribe({
                next: (res) => {
                    this.gn.confirmMessage='Registration successful';
                    this.gn.setConfirm();
                    resolve(res);
                },
                error: (err) => {
                    console.error(err);
                    if(err.error== "Reservation already exists"){
                        this.gn.errorMessage = err.error;
                        this.gn.setError();
                    }
                    else{
                        this.gn.errorMessage='Error, please try again later';
                        this.gn.setError();
                    }

                    reject(err);
                }
            });
        });
    }

    createMultipleReservation(reservations: Array<ReservationInputDTO>){
        return new Promise((resolve, reject) => {
            this.http.post<any>(`${environment.apiUrl}api/Reservation/multiple`, reservations).subscribe({
                next: (res) => {
                    // this.gn.confirmMessage='Registration successful';
                    // this.gn.setConfirm();
                    resolve(res);
                },
                error: (err) => {
                    console.error(err);
                    // this.gn.errorMessage='Error, please try again later';
                    // this.gn.setError();
                    reject(err);
                }
            });
        });
    }
}