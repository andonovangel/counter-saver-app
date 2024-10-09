import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { CounterService } from './counter.service';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss',
})
export class CounterComponent implements OnInit {
  clicks: number = 0;

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
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  click(): void {
    this.counterService.setClick(this.clicks + 1);
  }

  logout() {
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
