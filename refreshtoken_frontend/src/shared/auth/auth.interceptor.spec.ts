import {
  HttpClient,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
  HttpStatusCode,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { refreshTokenInterceptor } from './auth.interceptor';
import { ProfileService } from '../../app/profile/profile.service';
import { TokenService } from './token.service';
import { of, throwError } from 'rxjs';

describe('(unit) Auth interceptor', () => {
  let http: HttpClient;
  let tokenService: TokenService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([refreshTokenInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    tokenService = TestBed.inject(TokenService);
  });

  function runInterceptor(req: HttpRequest<any>, next: HttpHandlerFn) {
    return TestBed.runInInjectionContext(() =>
      refreshTokenInterceptor(req, next)
    );
  }

  it('Should return a status 401', () => {
    jest.spyOn(tokenService, 'isTokenExpired').mockReturnValue(true);
    jest.spyOn(tokenService, 'getToken').mockReturnValue('expiredtoken');

    const req = new HttpRequest('GET', 'api/example');
    const next = jest
      .fn()
      .mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 401 }))
      );

    runInterceptor(req, next).subscribe({
      error: (err: HttpErrorResponse) => {
        expect(err.status).toBe(401);
      },
    });
  });

  it('Should return a status 401', () => {
    jest.spyOn(tokenService, 'isTokenExpired').mockReturnValue(true);
    jest.spyOn(tokenService, 'getToken').mockReturnValue('expiredtoken');

    const req = new HttpRequest('GET', 'api/example');
    const next = jest
      .fn()
      .mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 401 }))
      );

    runInterceptor(req, next).subscribe({
      error: (err: HttpErrorResponse) => {
        expect(err.status).toBe(401);
      },
    });
  });

  it('Should return an error if token is null', (done) => {
    jest.spyOn(tokenService, 'getToken').mockReturnValue(null);

    const req = new HttpRequest('GET', '/api/test');
    const next = jest
      .fn()
      .mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 401 }))
      );

    runInterceptor(req, next).subscribe({
      error: (err) => {
        expect(err.status).toBe(401);
        expect(tokenService.getToken).toHaveBeenCalled();
        done();
      },
    });
  });

  it('Should make a new request with a new token', () => {
    jest.spyOn(tokenService, 'getToken').mockReturnValue('old.token');
    jest.spyOn(tokenService, 'isTokenExpired').mockReturnValue(true);

    const req = new HttpRequest('GET', 'api/example');
    const next = jest
      .fn()
      .mockReturnValueOnce(
        throwError(() => new HttpErrorResponse({ status: 401 }))
      )
      .mockReturnValueOnce(of({ jwt: 'new.token' }));

    runInterceptor(req, next).subscribe(() => {
      expect(http.post).toHaveBeenCalledWith(
        '/api/auth/refresh',
        {},
        { withCredentials: true }
      );
      expect(req).toHaveBeenCalledTimes(2);
    });
  });
});
