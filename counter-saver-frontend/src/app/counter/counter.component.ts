import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { CounterService } from './counter.service';
import { CounterCreateBody } from './counter-create-body';
import { CountersListSidebarComponent } from './counters-list-sidebar/counters-list-sidebar.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CountersListSidebarComponent],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss',
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('150ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class CounterComponent implements OnInit {
  public clicks: number = 0;
  public showActionButtons: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private counterService: CounterService
  ) {}

  ngOnInit(): void {
    this.subscribeToClicks();
  }

  subscribeToClicks(): void {
    this.counterService.clicks$.subscribe({
      next: (clicks: number) => {
        console.log(clicks);
        this.clicks = clicks;
        this.showActionButtons = clicks ? true : false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  click(): void {
    this.counterService.setClick(this.clicks + 1);
  }

  saveCounter(): void {
    this.counterService
      .saveCounter(new CounterCreateBody({ clicks: this.clicks }))
      .subscribe({
        next: (res) => {
          this.counterService.setClick(0);
          this.showActionButtons = false;
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  cancelCounter(): void {
    this.counterService.setClick(0);
    this.showActionButtons = false;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearTokens();
        this.router.navigate(['login']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // refresh() {
  //   console.log('refresh_token', this.authService.getRefreshToken());
  //   console.log('access_token', this.authService.getAccessToken());
  //   this.authService.refreshTokens().subscribe({
  //     next: (res) => {
  //       console.log(res);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }
}
