import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { GameModel } from '../models/game.model';
import { environment } from '../environment/environment';
import { Operation } from 'rfc6902';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }

  Games$: BehaviorSubject<GameModel[]> = new BehaviorSubject<GameModel[]>([]);
  gameDetail: GameModel | undefined;

  getGames() {
    return this.http.get<any>(`${environment.apiUrl}odata/Game`).subscribe(
      {
        next: (res) => {
          console.log(res.value);
          this.Games$.next(res.value);
        },
        error: (err) => {
          console.error(err);
        }
      }
    );
  }

   getDetails(id: number) {
     this.http.get<any>(`${environment.apiUrl}odata/Game/?$filter=gameId eq ${id}`).subscribe(
      {
        next: (res) => {
          console.log(res);
          console.log(res.value[0]);
          this.gameDetail = res.value[0];
        },
        error: (err) => {
          console.error(err);
        }
      }
    );
  }
  
  create(gameModel: any): Observable<GameModel> {
    return this.http.post<any>(`${environment.apiUrl}api/Game`, gameModel).pipe(
      tap((res) => {
        console.log('Game created successfully:', res);
        this.getGames(); 
      }),
      catchError((err) => {
        console.error('Error creating game:', err);
        return throwError(() => new Error('Error creating game'));
      })
    );
  }


  put(gameModel: GameModel, img: File): Promise<any>{
    const formData = new FormData();
    formData.append('file', img);         
  

    return new Promise((resolve, reject) => {
      this.http.put<GameModel>(
        `${environment.apiUrl}api/Game/image/${gameModel.gameId}`,formData
      ).subscribe({
        next: (res) => {
          this.gameDetail = res;
          const games = this.Games$.value;
          const index = games.findIndex(game => game.gameId === res.gameId);
          if (index !== -1) {
            games[index] = res;
            this.Games$.next(games);
          }
          console.log(res);
          resolve(res);
        },
        error: (err) => {
          console.error(err);
          reject(err);
        }
        
      });
    })
  }

  patch(gameDetail:GameModel, patch: Operation[]): Promise<any>{
    return new Promise((resolve, reject) => {
      
      this.http.patch<GameModel>(`${environment.apiUrl}api/Game/${gameDetail?.gameId}`, patch).subscribe({
        next: (res) => {
          console.log(res);
          const games = this.Games$.value;
          const index = games.findIndex(game => game.gameId === res.gameId);
          if (index !== -1) {
            games[index] = res;
            this.Games$.next(games);
            resolve(res);
          }
        },
        error: (err) => {
          console.error(err);
          reject(err);
        }
      })
    })
   }


   delete(id:number): Promise<void>{

    return new Promise((resolve, reject) => {
      
      this.http.delete(`${environment.apiUrl}api/Game/${id}`).subscribe({
        next: () => {
          console.log(`Game with ID ${id} deleted successfully.`);
          const games = this.Games$.value;
          this.Games$.next(games.filter((game) => game.gameId !== id));
          resolve();
        },
        error: (err) => {
          console.error(`Error deleting game with ID ${id}:`, err);
          reject(err);
        },
      })
    })
   }



}
