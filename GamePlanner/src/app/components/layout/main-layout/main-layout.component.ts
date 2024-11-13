import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { FooterComponent } from "../../footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { HeaderService } from '../../../services/header.service';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent,RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit{

  private lastScrollPosition = 0;


  constructor(private headerService: HeaderService, private ds: DashboardService) {}

  ngOnInit() {
    const content = document.querySelector('.main-content') as HTMLElement;
    if (content) {
      content.addEventListener('scroll', () => {
        const currentScroll = content.scrollTop;

        if (currentScroll > this.lastScrollPosition) {
          this.headerService.updateHeaderVisibility(false);
        } else {
          this.headerService.updateHeaderVisibility(true);
        }

        this.lastScrollPosition = currentScroll;
      });
    }
  
  
    
   
  }

 



}
