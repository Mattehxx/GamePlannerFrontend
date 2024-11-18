import { Injectable } from '@angular/core';
import { EventModel } from '../models/event.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { gameSessionModel } from '../models/gameSession.model';
import { reservationModel } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

    constructor(private http: HttpClient) { }

    sessionDetail : gameSessionModel | undefined;
    reservationDetail: reservationModel | undefined;

   getSessionById(id: number) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get<any>(`${environment.apiUrl}/odata/Session?$expand=Game,Reservations&$filter=sessionId eq ${id}`).subscribe({
                next: (res) => {
                    console.log(res.value[0]);
                    this.sessionDetail = res.value[0];
                    resolve(res.value[0]);
                },
                error: (err) => {
                    console.error(err);
                    reject(err);
                }
            });
        });
    }

    getReservationById(id: number) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get<any>(`${environment.apiUrl}/odata/Reservation?$expand=Session($expand=Game)&$filter=reservationId eq ${id}`).subscribe({
                next: (res) => {
                    console.log(res.value[0]);
                    this.sessionDetail = res.value[0];
                    resolve(res.value[0]);
                },
                error: (err) => {
                    console.error(err);
                    reject(err);
                }
            });
        });
    }

    confirmRegistration(sessionId: number, userId: string, token: string){
        return new Promise((resolve, reject) => {
            this.http.put<any>(`${environment.apiUrl}/api/Reservation/confirm?sessionId=${sessionId}&userId=${userId}&token=${token}`, '').subscribe({
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

    removeRegistration(reservationId: number, token: string){
        return new Promise((resolve, reject) => {
            this.http.put<any>(`${environment.apiUrl}/api/Reservation/delete?reservationId=${reservationId}}&token=${token}`, '').subscribe({
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