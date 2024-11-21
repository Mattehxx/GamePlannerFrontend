import { Injectable } from '@angular/core';
import { EventModel } from '../models/event.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MobileService {

    constructor(private http: HttpClient) { }

    linkApk: string | null = null;


    downloadFile() {
        return this.http.get<any>(`${environment.apiUrl}api/ApplicationUser/download-apk`).subscribe({
            next: (res) => {
                this.linkApk = res.message;
                console.log("si")
            },
            error: (err) => {
                console.log("no")
                console.error(err);
            }
        });
    }

}