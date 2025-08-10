import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';

describe('(unit) Auth Service', () => {
  let authService: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    authService = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('Should not signin user', () => {
    authService
      .signInUser({
        email: 'fake@email.com',
        password: '12345678',
        username: 'fakeusername',
      })
      .subscribe({
        next: () => {
          fail('Should have failed');
        },
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(400);
        },
      });

    const req = httpTesting.expectOne({ method: 'POST' });
    req.flush('bad request', { status: 400, statusText: 'Bad Request' });
  });
  it('Should signin user', () => {
    authService
      .signInUser({
        email: 'fake@email.com',
        password: '12345678',
        username: 'fakeusername',
      })
      .subscribe({
        next: (response) => {
          expect(response.status).toBe(201);
        },
        error: () => {
          fail('Should have passed');
        },
      });

    const req = httpTesting.expectOne({
      method: 'POST',
      url: '/api/auth/signin',
    });
    req.flush('created', { status: 201, statusText: 'created' });
  });
});
