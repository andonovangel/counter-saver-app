import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { CounterService } from './counter.service';
import { CounterCreateBody } from './counter-create-body';
import { CountersListSidebarComponent } from "./counters-list-sidebar/counters-list-sidebar.component";

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CountersListSidebarComponent],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss',
})
export class CounterComponent implements OnInit {
  public clicks: number = 0;
  public showSaveButton: boolean = false;

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
        this.showSaveButton = clicks ? true : false;
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
    this.counterService.saveCounter(new CounterCreateBody({clicks: this.clicks})).subscribe({
      next: res => {
        this.counterService.setClick(0);
        this.showSaveButton = false;
        console.log(res);
      },
      error: err => {
        console.log(err);
      },
    })
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
