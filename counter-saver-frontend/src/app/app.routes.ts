import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CounterComponent } from './counter/counter.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'counter',
    component: CounterComponent,
    canActivate: [authGuard],
  }
];
