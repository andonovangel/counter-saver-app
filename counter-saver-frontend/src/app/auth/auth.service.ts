import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { IUser } from '../user/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  public setTokens(access_token: string, refresh_token: string): void {
    this.cookieService.set('access_token', access_token, {});
    this.cookieService.set('refresh_token', refresh_token, {});
  }

  public getAccessToken(): string | null {
    return this.cookieService.get('access_token');
  }

  public getRefreshToken(): string | null {
    return this.cookieService.get('refresh_token');
  }

  public clearTokens(): void {
    console.log('clear tokens');
    this.cookieService.delete('access_token');
    this.cookieService.delete('refresh_token');
  }

  public isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  public signup(body: IUser): Observable<IUser> {
    console.log(body);
    return this.http.post<IUser>(`${this.apiUrl}/signup`, body);
  }

  public login(body: IUser): Observable<IUser> {
    console.log(body);
    return this.http.post<IUser>(`${this.apiUrl}/login`, body);
  }

  public logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {});
  }

  public refreshTokens(refresh_token: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/refresh`, { refresh_token });
  }
}
