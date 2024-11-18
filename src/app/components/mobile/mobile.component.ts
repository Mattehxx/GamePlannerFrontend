import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MobileService } from '../../services/mobile.service';

@Component({
  selector: 'app-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile.component.html',
  styleUrl: './mobile.component.scss'
})
export class MobileComponent {

  constructor(private mobileService: MobileService) { }

  downloadFile() {
    this.mobileService.downloadFile();
  }

}
