import { Injectable } from '@angular/core';
import { catchError, mapTo, of, Subject, tap, throwError } from 'rxjs';
import { Beer } from '../models/Beer.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BeersService {

  beers$ = new Subject<Beer[]>();

  constructor(private http: HttpClient,
              private auth: AuthService) {}

  getBeers() {
    this.http.get<Beer[]>('http://localhost:3000/api/beers').pipe(
      tap(beers => this.beers$.next(beers)),
      catchError(error => {
        console.error(error.error.message);
        return of([]);
      })
    ).subscribe();
  }

  getBeerById(id: string) {
    return this.http.get<Beer>('http://localhost:3000/api/beers/' + id).pipe(
      catchError(error => throwError(error.error.message))
    );
  }

  likeBeer(id: string, like: boolean) {
    return this.http.post<{ message: string }>(
      'http://localhost:3000/api/beers/' + id + '/like',
      { userId: this.auth.getUserId(), like: like ? 1 : 0 }
    ).pipe(
      mapTo(like),
      catchError(error => throwError(error.error.message))
    );
  }

  dislikeBeer(id: string, dislike: boolean) {
    return this.http.post<{ message: string }>(
      'http://localhost:3000/api/beers/' + id + '/like',
      { userId: this.auth.getUserId(), like: dislike ? -1 : 0 }
    ).pipe(
      mapTo(dislike),
      catchError(error => throwError(error.error.message))
    );
  }

  createBeer(beer: Beer, image: File) {
    const formData = new FormData();
    formData.append('beer', JSON.stringify(beer));
    formData.append('image', image);
    return this.http.post<{ message: string }>('http://localhost:3000/api/beers', formData).pipe(
      catchError(error => throwError(error.error.message))
    );
  }

  modifyBeer(id: string, beer: Beer, image: string | File) {
    if (typeof image === 'string') {
      return this.http.put<{ message: string }>('http://localhost:3000/api/beers/' + id, beer).pipe(
        catchError(error => throwError(error.error.message))
      );
    } else {
      const formData = new FormData();
      formData.append('beer', JSON.stringify(beer));
      formData.append('image', image);
      return this.http.put<{ message: string }>('http://localhost:3000/api/beers/' + id, formData).pipe(
        catchError(error => throwError(error.error.message))
      );
    }
  }

  deleteBeer(id: string) {
    return this.http.delete<{ message: string }>('http://localhost:3000/api/beers/' + id).pipe(
      catchError(error => throwError(error.error.message))
    );
  }
}
