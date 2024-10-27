import { Component, OnInit } from '@angular/core';
import { ICounter } from '../counter';
import { CounterService } from '../counter.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-counters-list-sidebar',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './counters-list-sidebar.component.html',
  styleUrl: './counters-list-sidebar.component.scss'
})
export class CountersListSidebarComponent implements OnInit {
  public countersList: ICounter[] = [];

  constructor(private counterService: CounterService) {}

  ngOnInit(): void {
    this.fetchCounters();
    this.subscribeToCountersList();
  }

  fetchCounters(): void {
    this.counterService.getCounters().subscribe({
      next: (list: ICounter[]) => {
        console.log(list);
        this.countersList = list;
      },
    });
  }

  subscribeToCountersList(): void {
    this.counterService.countersList$.subscribe({
      next: (list: ICounter[]) => {
        console.log(list);
        this.countersList = list;
      }
    });
  }
}
