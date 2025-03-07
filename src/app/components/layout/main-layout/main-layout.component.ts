import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { FooterComponent } from "../../footer/footer.component";
import { Event as RouterEvent, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { HeaderService } from '../../../services/header.service';
import { DashboardService } from '../../../services/dashboard.service';
import { EventsComponent } from '../../events/events.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneralService } from '../../../services/general.service';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent,RouterOutlet,CommonModule,FormsModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit{

  constructor(
    public headerService: HeaderService, 
    private ds: DashboardService,
    public gn: GeneralService,
    private router: Router,
    private viewportScroller: ViewportScroller,
    private as: AdminService
  ) {}

  private lastScrollPosition = 0;

  death$ = new Subject<void>();

  isOverlay : boolean = false;
  isLoading : boolean = false;
  
  @Output() scrollEvent = new EventEmitter<boolean>();

  get isOverlayVisible(): boolean {
    return this.gn.isLoading  || this.isOverlay;
  }

  ngOnInit() {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          if(document.getElementsByClassName('main-content')[0])
          document.getElementsByClassName('main-content')[0].scrollTo(0, 0);

          this.headerService.updateHeaderVisibility(true);
          this.headerService.filtersVisible = false;
          this.gn.isConfirmModal = false;
          this.gn.isSignModal = false;
          this.gn.isLoading = false
          this.gn.isOverlayOn$.next(false);
        }, 0);
      }
    });
    
    const content = document.querySelector('.main-content') as HTMLElement;
    if (content) {
      content.addEventListener('scroll', () => {
        const currentScroll = content.scrollTop;

        if(this.headerService.isModalOpen){
          this.headerService.isModalOpen = false;
        }

        if (!this.isMobile()) {
          if (currentScroll > this.lastScrollPosition) {
            this.headerService.updateHeaderVisibility(false);
          } else {
            this.headerService.updateHeaderVisibility(true);
          }
        }
        this.scrollEvent.emit(currentScroll > 0);

        if(currentScroll > 370){
          this.gn.isInputFixed$.next(true);
          if(this.isMobile() &&  this.router.url === '/events'){
            this.headerService.updateHeaderTitleVisiblity(true);
          }
          else{
            this.headerService.updateHeaderTitleVisiblity(false);
          }
        }
        else{
          if(this.gn.isInputFixed$.value){
            this.gn.isInputFixed$.next(false);
          }
          if(this.headerService.getTitleVisibility()){
            this.headerService.updateHeaderTitleVisiblity(false);
          }
        }

        this.lastScrollPosition = currentScroll;
      });
    }    

    this.gn.isOverlayOn$.pipe(takeUntil(this.death$)).subscribe((value) => {
      if(value){
        this.isOverlay = true;
      }
      else{
        this.isOverlay = false;
      }
    });

    this.gn.isLoadingScreen$.pipe(takeUntil(this.death$)).subscribe((value) => {
      if(value){
        this.isLoading = true;
      }
      else{
        this.isLoading = false;
      }
    });

    this.headerService.ScrollToHalf$.pipe(takeUntil(this.death$)).subscribe((value) => {
      if(value){
        setTimeout(() => {
            const content = document.getElementsByClassName('main-content')[0];
            if (content) {
            content.scrollTo(0, Math.floor(window.innerHeight / 2) - 200);
            }
        }, 0);
      }
    });
   
  }
    
  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  onActivate(event: any) {
    if (event instanceof EventsComponent) {
      this.scrollEvent.subscribe((isScrolled: boolean) => {
        event.isScrolled = isScrolled;
      });
    }
  }
}
