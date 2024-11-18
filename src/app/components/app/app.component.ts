import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationsComponent } from "../notifications/notifications.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{

  userId: string | null = null;

  constructor(private as: AuthService) {
    this.userId = localStorage.getItem("userId");
     console.log(this.userId);
    if (this.userId) {
      this.as.isLogged = true;
      this.as.getUser(this.userId)
    }
  }

}
