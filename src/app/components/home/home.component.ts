import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DurationPipe } from '../../pipes/duration.pipe';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, DurationPipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  //#region Models
  //#endregion
  constructor(public router: Router, protected eventService: EventService) { }

  ngOnInit(): void {
    this.eventService.getUpcomingEvents();
  }

  @ViewChild('eventList') eventList!: ElementRef;

  private touchStartX: number = 0;
  private touchEndX: number = 0;

  handleTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  handleTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipe();
  }

  private handleSwipe() {
    const swipeDistance = this.touchEndX - this.touchStartX;
    const container = this.eventList.nativeElement;
    const scrollAmount = container.offsetWidth * 0.8;
  }

  scrollLeft() {
    const container = this.eventList.nativeElement;
    const scrollAmount = container.offsetWidth * 0.2;
    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    const container = this.eventList.nativeElement;
    const scrollAmount = container.offsetWidth * 0.2; // Scroll 80% of container width
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }

  navigateToEvent() {
    this.router.navigate(['/events']);
  }

}
