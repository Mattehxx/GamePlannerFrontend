import { Injectable } from '@angular/core';
import { EventModel } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  eventDetail: EventModel | undefined;

  isSessionModal : boolean = false;

  isConfirmModal : boolean = false; 
  isLoading: boolean = false;

}