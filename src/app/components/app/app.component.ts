import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  userId: string | null

  constructor(private as: AuthService) {
    this.userId = localStorage.getItem("userId")
  }

  ngOnInit(): void {
    if (this.userId) {
      this.as.getUser(this.userId)
    }
  }

}
