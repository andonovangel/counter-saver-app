import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { CounterCreateBody } from './counter-create-body';
import { ICounter } from './counter';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  private apiUrl = 'http://localhost:3000/counters';

  private clicksSubject: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  public clicks$: Observable<number> = this.clicksSubject.asObservable();

  private countersListSubject: BehaviorSubject<ICounter[]> =
    new BehaviorSubject<ICounter[]>([]);
  public countersList$: Observable<ICounter[]> =
    this.countersListSubject.asObservable();

  constructor(private http: HttpClient) {}

  setClick(clicks: number): void {
    this.clicksSubject.next(clicks);
  }

  getCounters(): Observable<ICounter[]> {
    return this.http.get<ICounter[]>(`${this.apiUrl}`).pipe(
      tap((counters: ICounter[]) => {
        this.countersListSubject.next(counters);
      })
    );
  }

  saveCounter(body: CounterCreateBody): Observable<ICounter> {
    return this.http.post<ICounter>(`${this.apiUrl}`, body).pipe(
      tap(() => {
        this.getCounters().subscribe();
      })
    );
  }
}
