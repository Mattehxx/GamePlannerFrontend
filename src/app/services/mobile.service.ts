import { Injectable } from '@angular/core';
import { EventModel } from '../models/event.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class MobileService {

    constructor(private http: HttpClient) { }

    linkApk: string | null = null;


    downloadFile() {
        return this.http.get<any>(`${environment.apiUrl}/api/ApplicationUser/download-apk`).subscribe({
            next: (res) => {
                console.log(res);
                this.linkApk = res.message;
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

}