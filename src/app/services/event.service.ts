import { Injectable } from '@angular/core';
import { EventModel, EventSessionsModel } from '../models/event.model';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { ODataResponse } from '../models/odataResponse.model';
import { EventInputModel } from '../models/input-models/event.input.model';
import { Operation } from 'rfc6902';

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
    return new Promise((resolve, reject) => {
      const params: HttpParams = new HttpParams()
        .append('expand', 'AdminUser')
        .append('expand', 'Sessions($filter=isDeleted eq false)');
      this.http.get<ODataResponse<EventModel>>(`${environment.apiUrl}odata/Event`, { params }).subscribe({
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

  post(model: EventInputModel): Promise<EventModel> {
    const formData = new FormData();
    Object.keys(model).forEach(key => {
      const value = model[key as keyof EventInputModel];
      if (value !== null) {
        if (key === 'image' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    return new Promise((resolve, reject) => {
      this.http.post<EventModel>(`${environment.apiUrl}api/Event`, formData).subscribe({
        next: (res) => {
          const events = this.eventSubject.value;
          events.push(res);
          this.eventSubject.next(events);
          resolve(res);
        }, error: (msg) => {
          console.error(msg);
          reject(msg);
        }
      });
    });
  }

  public delete(id: number) {
    this.http.delete<EventModel>(`${environment.apiUrl}api/Event/${id}`).subscribe({
      next: (res) => {
        this.deletedEventDetail = res;
      }, error: (msg) => {
        console.error(msg);
      }
    });
  }
  
  patch(eventDetail:number, patch: Operation[]): Promise<any>{
    return new Promise((resolve, reject) => {
      this.http.patch<EventModel>(`${environment.apiUrl}api/Event/${eventDetail}`, patch).subscribe({
        next: (res) => {
          const events = this.eventSubject.value;
          const index = events.findIndex((e) => e.eventId === eventDetail);
          if (index !== -1) {
            events[index] = res;
            this.eventSubject.next(events);
          }
          resolve(res);
        },
        error: (err) => {
          console.error(err);
          reject(err);
        }
      })
    })
   }


  getEventCount(): Observable<number> {
    const query = `${environment.apiUrl}odata/Event?$count=true&$filter=isDeleted eq false and isPublic eq true`;
    return this.http.get<any>(query).pipe(
      map(response => response['@odata.count'])
    );
  }

  getPagination(skip: number = 0, top: number = 10) {
    const query = `${environment.apiUrl}odata/Event?$count=true&$filter=isDeleted eq false and isPublic eq true&$skip=${skip}&$top=${top}`;
    const expandedQuery = `${query}&$expand=Sessions($filter=isDeleted eq false;$expand=Game,Reservations)`;
    return this.http.get<ODataResponse<EventModel>>(expandedQuery).pipe(
      map((res: ODataResponse<EventModel>) => {
        this.eventSubject.next(res.value);
        return res;
      })
    );
  }

  filterEventsByName(name: string, skip: number = 0, top: number = 10): Observable<ODataResponse<EventModel>> {
    const query = `${environment.apiUrl}odata/Event?$filter=contains(tolower(name),'${name.toLowerCase()}')&$skip=${skip}&$top=${top}`;
    const expandedQuery = `${query}&$expand=Sessions($expand=Game,Reservations)`;
    return this.http.get<ODataResponse<EventModel>>(expandedQuery).pipe(
      map((res: ODataResponse<EventModel>) => {
        this.eventSubject.next(res.value);
        return res;
      })
    );
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

  getEventsId(id: number) : Promise<EventModel>{
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${environment.apiUrl}odata/Event?$filter=eventId eq ${id}&$expand=Sessions($filter=isDeleted eq false;$expand=Master,Game,Reservations($filter=isDeleted eq false;$expand=User))`).subscribe({
        next: (res) => {
          this.eventDetail = res.value[0];
          resolve(res.value[0]);
        }, error: (msg) => {
          console.error(msg);
          reject(msg);
        }
      });
    });
  }

  getUsersContainsString(name: string) {
    return this.http.get<any>(`${environment.apiUrl}odata/ApplicationUser?$filter=contains(tolower(name),'${name.toLowerCase()}')&$top=5`);
  }
  
  getGames(){
    return this.http.get<any>(`${environment.apiUrl}odata/Game`);
  }

  getGameMasters(gameId: number){
    return this.http.get<any>(`${environment.apiUrl}odata/ApplicationUser?$filter=Preferences/any(p: p/gameId eq ${gameId} and p/CanBeMaster eq true)&$expand=Preferences`);
  }

  updateEventImage(eventId: number, img: FormData): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put<any>(`${environment.apiUrl}api/Event/image/${eventId}`, img).subscribe({
        next: (res) => {
          this.eventDetail = res;
          resolve(res);
        }, error: (msg) => {
          console.error(msg);
          reject(msg);
        }
      });
    });
  }

  deleteEvent(eventId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.delete(`${environment.apiUrl}api/Event/${eventId}`).subscribe({
        next: () => {
          const events = this.eventSubject.value.filter(event => event.eventId !== eventId);
          this.eventSubject.next(events);
          resolve();
        },
        error: (err) => {
          console.error(err);
          reject(err);
        }
      });
    });
  }

}