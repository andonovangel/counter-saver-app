import { Component, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth/auth.service';
import { IUser } from '../user/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  public formGroup!: FormGroup;
  public readonly usernameFormControlName = 'username';
  public readonly usernameFormControlLabel = 'Username';
  public readonly passwordFormControlName = 'password';
  public readonly passwordFormControlLabel = 'Password';

  public hide = signal(true);

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  clickEvent(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.authService.signup(this.formGroup.value).subscribe({
        next: (user: IUser) => {
          console.log(user);
          this.authService.setTokens(user.accessToken, user.refreshToken);
          this.router.navigate(['counter']);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
