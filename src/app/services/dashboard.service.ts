import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  isOpen: boolean = false;
  userDetailPanel : boolean = false;
  
}
