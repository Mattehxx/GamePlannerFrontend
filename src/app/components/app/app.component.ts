import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { KnowledgeService } from '../../services/knowledge.service';
import { NotificationsComponent } from "../notifications/notifications.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  userId: string | null = null;
  games = [];
  constructor(private as: AuthService, private gs: GameService,private ks: KnowledgeService) {
    this.userId = localStorage.getItem("userId");
    if (this.userId) {
      this.as.isLogged = true;
      this.as.getUser(this.userId)
    }
    this.gs.getGames();
    this.ks.getKnowledges();
    this.as.loginIsAdmin();
  }

}
