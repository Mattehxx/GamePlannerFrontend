import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneralService } from '../../../services/general.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent implements OnInit,OnDestroy{

  constructor(public gn: GeneralService) {}

  death$ = new Subject<void>();

  isOverlay : boolean = false;
  isLoading : boolean = false;

  ngOnInit(): void {
    this.gn.isOverlayOn$.pipe(takeUntil(this.death$)).subscribe((value) => {
      if(value){
        this.isOverlay = true;
      }
      else{
        this.isOverlay = false;
      }
    });
    this.gn.isLOadingScreen$.pipe(takeUntil(this.death$)).subscribe((value) => {
      if(value){
        this.isLoading = true;
      }
      else{
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.death$.next();
    this.death$.complete();
  }




  get isOverlayVisible(): boolean {
    return this.gn.isDeleteUserModal || this.gn.isCreateUserModal  || this.isOverlay;
  }
  

 
}
