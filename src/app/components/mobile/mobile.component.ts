import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MobileService } from '../../services/mobile.service';

@Component({
  selector: 'app-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile.component.html',
  styleUrl: './mobile.component.scss'
})
export class MobileComponent implements OnInit {

  constructor(public mobileService: MobileService) { }

  ngOnInit(): void {
    this.mobileService.downloadFile();
  }

  getLink() : string {
    return this.mobileService.linkApk || '';
  }

 
}
