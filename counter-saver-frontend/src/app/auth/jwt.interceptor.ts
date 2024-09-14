import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accessToken = inject(AuthService).getAccessToken();
  const newReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return next(newReq).pipe(
    catchError((error: any) => {
      if (error.status === 401) {
        return refreshAccessToken().pipe(
          switchMap((newAccessToken) => {
            const cookieService = inject(CookieService);
            cookieService.set('access_token', newAccessToken, {});

            const retryRequest = newReq.clone({
              setHeaders: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            });
            return next(retryRequest);
          })
        );
      }
      return throwError(error);
    })
  );
};

export function refreshAccessToken(): Observable<string> {
  const cookieService = inject(CookieService);
  const auth = inject(AuthService);
  const refreshToken = cookieService.get('refresh_token');

  return auth.refreshTokens(refreshToken);
}
