import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { ITokens } from './tokens';
import { environment } from '../../environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  if (req.url.includes(environment.refreshTokenEndpoint)) {
    return next(req);
  }

  let accessToken = auth.getAccessToken();
  if (accessToken) {
    req = addToken(req, accessToken);
  }

  return next(req)
  .pipe(
    catchError((error) => {
      if (error.status === 401 && accessToken) {
        return auth.refreshTokens().pipe(
          switchMap((newTokens: ITokens) => {
            auth.setTokens(newTokens.accessToken, newTokens.refreshToken);
            const newAccessToken = auth.getAccessToken();
            if (newAccessToken) {
              req = addToken(req, newAccessToken);
            }

            return next(req);
          }),
          catchError((refreshError) => {
            auth.clearTokens();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};

function addToken(request: HttpRequest<unknown>, token: string | null) {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}
