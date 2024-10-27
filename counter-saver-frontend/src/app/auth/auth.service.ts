import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { IUser } from '../user/user';
import { ITokens } from './tokens';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  public setTokens(accessToken: string, refreshToken: string): void {
    this.cookieService.set('accessToken', accessToken, {});
    this.cookieService.set('refreshToken', refreshToken, {});
  }

  public getAccessToken(): string | null {
    return this.cookieService.get('accessToken');
  }

  public getRefreshToken(): string | null {
    return this.cookieService.get('refreshToken');
  }

  public clearTokens(): void {
    this.cookieService.delete('accessToken');
    this.cookieService.delete('refreshToken');
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

  public refreshTokens(): Observable<ITokens> {
    const token = this.getRefreshToken();
    return this.http.post<ITokens>(`${this.apiUrl}/refresh`, { token });
  }
}
