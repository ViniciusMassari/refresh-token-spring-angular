import { TestBed } from '@angular/core/testing';

import { ProfileService } from './profile.service';
import { TokenService } from '../../shared/auth/token.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('(unit) ProfileService tests', () => {
  let tokenService: TokenService;
  let profileService: ProfileService;
  let httpTesting: HttpTestingController;
  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    tokenService = TestBed.inject(TokenService);
    profileService = TestBed.inject(ProfileService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('Should do a GET request', () => {
    profileService.getResource().subscribe();
    const req = httpTesting.expectOne('/api/user/get-resource');
    expect(req.request.method).toBe('GET');
  });
});
