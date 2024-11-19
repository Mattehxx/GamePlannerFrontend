import { Injectable } from '@angular/core';
import { EventModel } from '../models/event.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { gameSessionModel } from '../models/gameSession.model';
import { reservationModel } from '../models/reservation.model';
import { GeneralService } from './general.service';
import { Operation } from 'rfc6902';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

    constructor(private http: HttpClient,private gn: GeneralService) { }

    sessionDetail : gameSessionModel | undefined;
    reservationDetail: reservationModel | undefined;

   getSessionById(id: number) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get<any>(`${environment.apiUrl}odata/Session?$expand=Game,Reservations&$filter=sessionId eq ${id}`).subscribe({
                next: (res) => {
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
            this.http.get<any>(`${environment.apiUrl}odata/Reservation?$expand=Session($expand=Game)&$filter=reservationId eq ${id}`).subscribe({
                next: (res) => {
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
            this.http.put<any>(`${environment.apiUrl}api/Reservation/confirm?sessionId=${sessionId}&userId=${userId}&token=${token}`, '').subscribe({
                next: (res) => {
                    this.gn.confirmMessage='Registration confirmed';
                    this.gn.setConfirm();
                    resolve(res);
                },
                error: (err) => {
                    this.gn.errorMessage='Error, please try again later';
                    this.gn.setError();
                    reject(err);
                }
            });
        });
    }

    removeRegistration(reservationId: number) {
        return new Promise((resolve, reject) => {
            this.http.delete<any>(`${environment.apiUrl}api/Reservation?id=${reservationId}`).subscribe({
                next: (res) => {
                    this.gn.confirmMessage='Registration removed';
                    this.gn.setConfirm();
                    resolve(res);
                },
                error: (err) => {
                    console.error(err);
                    this.gn.errorMessage='Error, please try again later';
                    this.gn.setError();
                    reject(err);
                }
            });
        });
    }

    newConfirm(sessionId: number,userId: string) : Promise<any>{
        return new Promise((resolve, reject) => {
            this.http.post<any>(`${environment.apiUrl}api/Reservation/confirm?sessionId=${sessionId}&userId=${userId}`, '').subscribe({
                next: (res) => {
                    this.gn.errorMessage='Error, a new confirmation email has been sent';
                    this.gn.setError();
                    resolve(res);
                },
                error: (err) => {
                    console.error(err);
                    this.gn.errorMessage='Error, please try again later';
                    this.gn.setError();
                    reject(err);
                }
            });
        });
    }

    addSession(session: gameSessionModel) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post<any>(`${environment.apiUrl}api/Session`, session).subscribe({
                next: (res) => {
                    this.gn.confirmMessage='Session created';
                    this.gn.setConfirm();
                    resolve(res);
                },
                error: (err) => {
                    console.error(err);
                    this.gn.errorMessage='Error, please try again later';
                    this.gn.setError();
                    reject(err);
                }
            });
        });
    }

    addSessionNoNoti(session: any) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post<any>(`${environment.apiUrl}api/Session`, session).subscribe({
                next: (res) => {
                    // this.gn.confirmMessage='Session created';
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

    updateSession(sessionId: number, patch: Operation[]) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.patch<any>(`${environment.apiUrl}api/Session/${sessionId}`, patch).subscribe({
                next: (res) => {
                    // this.gn.confirmMessage='Session updated';
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

    deleteSession(sessionId: number) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.delete<any>(`${environment.apiUrl}api/Session/${sessionId}`).subscribe({
                next: (res) => {
                    // this.gn.confirmMessage='Session deleted';
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