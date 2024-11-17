import { Injectable } from '@angular/core';
import { EventModel } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  eventDetail: EventModel | undefined;

}