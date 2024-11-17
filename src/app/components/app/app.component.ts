import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private router: Router,private gn: GeneralService) {
    this.router.events.subscribe(event => {
      if(this.gn.isOverlayOn$.value){
        this.gn.isOverlayOn$.next(false);
      }
    });
  }

}
