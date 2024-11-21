import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Operation } from 'rfc6902';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';
import { ODataResponse } from '../models/odataResponse.model';
import { preferenceInputModel, preferenceModel } from '../models/preference.model';
import { AuthService } from './auth.service';
import { GeneralService } from './general.service';

@Injectable({
    providedIn: 'root'
})
export class PreferenceService {

    odataQuery: string | undefined;
    toAddPreference: Array<preferenceInputModel> = [];
    private preferenceSubject = new BehaviorSubject<preferenceModel[]>([]);
    userPreference$ = this.preferenceSubject.asObservable();
    constructor(private http: HttpClient, private as: AuthService, private gn: GeneralService) { }


    //#region  CRUD
    getUserPreference() {
        const params = new HttpParams()
            .append('expand', 'game')
            .append('expand', 'knowledge')
            .append('expand', 'user');
        let userId = this.as.getUserId();
        userId != null ? params.append('filter', `userId eq${userId}`) : null;
        this.http.get<ODataResponse<preferenceModel>>(`${environment.apiUrl}odata/Preference`, { params }).subscribe({
            next: (res) => {
                this.preferenceSubject.next(res.value);
            }, error: (msg) => {
                console.error(msg);
            }
        });
    }

    post(preference: preferenceInputModel) {
        return new Promise((resolve, reject) => {
            let userId = this.as.getUserId();
            if (userId) {
                preference.userId = userId;
            } else {
                reject("invalid user");
                return;
            }
            this.http.post<preferenceModel>(`${environment.apiUrl}api/Preference`, preference).subscribe({
                next: (res) => {
                    const pref = this.preferenceSubject.value;
                    pref.push(res);
                    this.preferenceSubject.next(pref);
                    resolve(res);
                }, error: (msg) => {
                    console.error(msg);
                    reject(msg);
                }
            });
        });
    }
    
    patch(op: Operation[]) {
        return new Promise((resolve, reject) => {
            this.http.patch<preferenceModel>(`${environment.apiUrl}api/Preference`, op).subscribe({
                next: (res) => {
                    const pref = this.preferenceSubject.value;
                    pref.map(p => {
                        p.preferenceId == res.preferenceId ? res : p;
                    });
                    this.preferenceSubject.next(pref);
                    resolve(res);
                }, error: (msg) => {
                    reject(msg);
                }
            });
        });
    }
    delete(id: number) {
        return new Promise((resolve, reject) => {
            this.http.delete(`${environment.apiUrl}odata/Preference/${id}`).subscribe({
                next: (res) => {
                    resolve(res);
                }, error: (msg) => {
                    reject(msg);
                }
            });
        });
    }
    //#endregion
}