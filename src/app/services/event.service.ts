import { Injectable } from '@angular/core';
import { EventModel, EventSessionsModel } from '../models/event.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environment/environment';
import { ODataResponse } from '../models/odataResponse.model';
import { EventInputModel } from '../models/input-models/event.input.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  eventDetail: EventModel | undefined;
  deletedEventDetail: EventModel | undefined;
  odataQuery: string | undefined;

  private eventSubject = new BehaviorSubject<EventModel[]>([]);
  private upcomingEventSubject = new BehaviorSubject<EventSessionsModel[]>([]);
  isModalOpen: boolean = false;
  event$ = this.eventSubject.asObservable();
  upcomingEvent$ = this.upcomingEventSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  //#region CRUD
  get() {
    return new Promise((resolve,reject) => {
      /* const x = `${this.odataQuery && this.odataQuery.trim() != ""
          ? `${this.odataQuery}` : ""}?$expand=AdminUser,Sessions`; */
      const params: HttpParams = new HttpParams()
      .append('expand', 'AdminUser').append('expand','Sessions');
      this.http.get<ODataResponse<EventModel>>(`${environment.apiUrl}odata/Event`, {params}).subscribe({
            next: (res) => {
              this.eventSubject.next(res.value);
              resolve(res);
            }, error: (msg) => {
              console.error(msg);
              reject(msg);
            }
          });
    });
  }
  post(model: EventInputModel) {
    this.http.post<EventModel>(`${environment.apiUrl}api/Event`, model).subscribe({
      next: (res) => {
        const events = this.eventSubject.value;
        events.push(res);
        this.eventSubject.next(events);
      }, error: (msg) => {
        console.error(msg);
      }
    });
  }
  delete(id: number) {
    this.http.delete<EventModel>(`${environment.apiUrl}/api/Event/${id}`).subscribe({
      next: (res) => {
        this.deletedEventDetail = res;
      }, error: (msg) => {
        console.error(msg);
      }
    });
  }
  patch() {

  }

  //#endregion

  //eventualmente spostare in session
  getUpcomingEvents() {
    this.http.get<Array<EventSessionsModel>>(`${environment.apiUrl}api/Session/upcoming`).subscribe({
      next: (res) => {
        this.upcomingEventSubject.next(res);
      }, error: (msg) => {
        console.error(msg);
      }
    })
  }
}