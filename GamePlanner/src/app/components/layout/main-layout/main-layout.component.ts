import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { FooterComponent } from "../../footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { HeaderService } from '../../../services/header.service';
import { DashboardService } from '../../../services/dashboard.service';
import { EventsComponent } from '../../events/events.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent,RouterOutlet,CommonModule,FormsModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit{

  private lastScrollPosition = 0;
  @Output() scrollEvent = new EventEmitter<boolean>();

  get isOverlayVisible(): boolean {
    return this.headerService.filtersVisible || this.gn.isSessionModal || this.gn.isConfirmModal || this.gn.isSignModal || this.gn.isLoading;
  }

  constructor(public headerService: HeaderService, private ds: DashboardService,public gn: GeneralService) {}

  ngOnInit() {
    const content = document.querySelector('.main-content') as HTMLElement;
    if (content) {
      content.addEventListener('scroll', () => {
        const currentScroll = content.scrollTop;

        if(this.headerService.isModalOpen){
          this.headerService.isModalOpen = false;
        }

        if (currentScroll > this.lastScrollPosition) {
          this.headerService.updateHeaderVisibility(false);
        } else {
          this.headerService.updateHeaderVisibility(true);
        }

        this.scrollEvent.emit(currentScroll > 0);

        this.lastScrollPosition = currentScroll;
      });
    }

    
  
  
    
   
  }

  onActivate(event: any) {
    if (event instanceof EventsComponent) {
      this.scrollEvent.subscribe((isScrolled: boolean) => {
        event.isScrolled = isScrolled;
      });
    }
  }
}
