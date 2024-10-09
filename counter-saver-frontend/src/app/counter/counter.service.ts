import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private clicksSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public clicks$: Observable<number> = this.clicksSubject.asObservable();

  constructor() {}

  setClick(clicks: number): void {
    this.clicksSubject.next(clicks);
  }
}
