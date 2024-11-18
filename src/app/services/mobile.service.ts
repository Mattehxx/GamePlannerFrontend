import { Injectable } from '@angular/core';
import { EventModel } from '../models/event.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class MobileService {

    constructor(private http: HttpClient) { }


    downloadFile() {
        return this.http.get(`${environment.apiUrl}/ApplicationUser/download-apk`).subscribe({
            next: (res) => {
                console.log(res);
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

}