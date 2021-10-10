import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Hero } from './hero';
import { MessageService } from './message.service';
import { HEROES } from './mock-heroes';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private messageService: MessageService, private http: HttpClient) { }

  private heroesURL = 'api/heroes';

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    //  send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}

  /** Log a HeroService message with the MessageService */
  private log(message: string){
    this.messageService.add(message);
  }

  /** GET heroes from the server */
  getHeros(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesURL)
    .pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeros',[]))
    )
  }

  getHero(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${this.heroesURL}/${id}`)
    .pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesURL, hero, this.httpOptions)
    .pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updated hero'))
    )
  }

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesURL, hero, this.httpOptions)
    .pipe(
      tap((newHero: Hero) => this.log(`insert hero ${newHero.id}`)),
      catchError(this.handleError<Hero>('insert hero'))
    )
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero): Observable<Hero> {
    return this.http.delete<Hero>(`${this.heroesURL}/${hero.id}`, this.httpOptions)
    .pipe(
      tap(_ => this.log(`deleted hero id=${hero.id}`)),
      catchError(this.handleError<Hero>('remove hero'))
    )
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim()) return of([]);

    return this.http.get<Hero[]>(`${this.heroesURL}/?name=${term}`)
    .pipe(
      tap(heroes => heroes.length ? this.log(`found heroes matching: ${term}`) : this.log(`no heroes matching: ${term}`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    )
  }
}
