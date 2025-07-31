import {
  HttpClient,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injector, runInInjectionContext, signal } from '@angular/core';
import {
  catchError,
  filter,
  finalize,
  first,
  interval,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { TokenService } from './token.service';
import { RefreshTokenResponse } from '../../types/refreshToken';
const TOKEN_HEADER_KEY = 'Authorization';
const currentToken = signal<null | string>(null);
const isRefreshing = signal(false);
export const refreshTokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const tokenService = inject(TokenService);
  const http = inject(HttpClient);
  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        const token = tokenService.getToken();
        if (!token) {
          return throwError(() => error);
        }
        if (error.status === 401 && tokenService.isTokenExpired(token)) {
          if (!isRefreshing()) {
            isRefreshing.set(true);
            currentToken.set(null);

            return http
              .post<RefreshTokenResponse>(
                '/api/auth/refresh',
                {},
                { withCredentials: true }
              )
              .pipe(
                take(1),
                switchMap((response) => {
                  currentToken.set(response.jwt);
                  const authReq = req.clone({
                    withCredentials: true,
                    setHeaders: {
                      [TOKEN_HEADER_KEY]: 'Bearer ' + currentToken(),
                    },
                  });
                  return next(authReq);
                }),
                catchError((error) => throwError(() => error)),
                finalize(() => isRefreshing.set(false))
              );
          } else {
            return interval(100).pipe(
              filter(() => !!currentToken()),
              first(),
              switchMap(() => {
                const newToken = currentToken();
                if (!newToken)
                  return throwError(() => new Error('Token not available'));
                const authReq = req.clone({
                  withCredentials: true,
                  setHeaders: {
                    [TOKEN_HEADER_KEY]: 'Bearer ' + newToken,
                  },
                });
                return next(authReq);
              })
            );
          }
        }
      }

      return throwError(() => error);
    })
  );
};
