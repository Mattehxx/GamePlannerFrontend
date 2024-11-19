import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Operation } from 'rfc6902';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../environment/environment';
import { knowledgeModel } from '../models/knowledge.model';

@Injectable({
    providedIn: 'root'
})
export class KnowledgeService {

    constructor(private http: HttpClient) { }

    Knowledges$: BehaviorSubject<knowledgeModel[]> = new BehaviorSubject<knowledgeModel[]>([]);
    knowledgeDetail: knowledgeModel | undefined;

    getKnowledges() {
        return this.http.get<any>(`${environment.apiUrl}odata/Knowledge`).subscribe(
            {
                next: (res) => {
                    this.Knowledges$.next(res.value);
                },
                error: (err) => {
                    console.error(err);
                }
            }
        );
    }

    getDetails(id: number) {
        this.http.get<any>(`${environment.apiUrl}odata/Knowledge/?$filter=knowledgeId eq ${id}`).subscribe(
            {
                next: (res) => {
                    this.knowledgeDetail = res.value[0];
                },
                error: (err) => {
                    console.error(err);
                }
            }
        );
    }

    create(knowledgeModel: any): Observable<knowledgeModel> {
        return this.http.post<any>(`${environment.apiUrl}api/Knowledge`, knowledgeModel).pipe(
            tap((res) => {
                this.getKnowledges(); 
            }),
            catchError((err) => {
                console.error('Error creating knowledge:', err);
                return throwError(() => new Error('Error creating knowledge'));
            })
        );
    }

    patch(knowledgeDetail: knowledgeModel, patch: Operation[]): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.patch<knowledgeModel>(`${environment.apiUrl}api/Knowledge/${knowledgeDetail?.knowledgeId}`, patch).subscribe({
                next: (res) => {
                    const knowledges = this.Knowledges$.value;
                    const index = knowledges.findIndex(knowledge => knowledge.knowledgeId === res.knowledgeId);
                    if (index !== -1) {
                        knowledges[index] = res;
                        this.Knowledges$.next(knowledges);
                        resolve(res);
                    }
                },
                error: (err) => {
                    console.error(err);
                    reject(err);
                }
            });
        });
    }

    delete(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.http.delete(`${environment.apiUrl}api/Knowledge/${id}`).subscribe({
                next: () => {
                    const knowledges = this.Knowledges$.value;
                    this.Knowledges$.next(knowledges.filter((knowledge) => knowledge.knowledgeId !== id));
                    resolve();
                },
                error: (err) => {
                    console.error(`Error deleting knowledge with ID ${id}:`, err);
                    reject(err);
                },
            });
        });
    }
}
