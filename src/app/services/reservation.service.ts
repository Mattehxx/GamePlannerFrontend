import { Injectable } from '@angular/core';
import { EventModel } from '../models/event.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

    constructor(private http: HttpClient,private as: AuthService) { }

    
    createReservation(sessionId: number){
        let userId = localStorage.getItem('userId');
        return new Promise((resolve, reject) => {
            this.http.post<any>(`${environment.apiUrl}api/Reservation`, {sessionId,userId}).subscribe({
                next: (res) => {
                    console.log(res);
                    resolve(res);
                },
                error: (err) => {
                    console.error(err);
                    reject(err);
                }
            });
        });
    }
}