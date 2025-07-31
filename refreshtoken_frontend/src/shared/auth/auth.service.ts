import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { SignInInfo } from '../../types/signIn';
import { HttpClient } from '@angular/common/http';
import {
  JWTLoginPayload,
  LoginRequestData,
  LoginResponse,
  UserInfo,
} from '../../types/login';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  #http = inject(HttpClient);
  tokenService = inject(TokenService);

  #token: WritableSignal<string> = signal('');
  public userToken = this.#token.asReadonly();

  public isLoggedIn = signal(false);

  public currentUser: WritableSignal<null | UserInfo> = signal(null);

  public signInUser(userInfo: SignInInfo) {
    return this.#http.post('/api/auth/signin', userInfo, {
      observe: 'response',
    });
  }

  public loginUser(userInfo: LoginRequestData) {
    return this.#http.post<LoginResponse>('/api/auth/login', userInfo, {
      observe: 'response',
    });
  }

  saveUserInfo(token: string) {
    this.tokenService.saveToken(token);
    const payload = this.tokenService.decodeToken(token);
    this.currentUser.set({
      username: payload.username,
      email: payload.email,
      id: payload.sub,
    });
  }

  logout() {
    this.tokenService.removeToken();
    this.currentUser.set(null);
  }

  restoreUserFromToken() {
    const token = this.tokenService.getToken();
    if (token) {
      const payload = this.tokenService.decodeToken(token);
      this.currentUser.set({
        username: payload.username,
        email: payload.email,
        id: payload.sub,
      });
      this.isLoggedIn.set(true);
    }
  }

  verifyIfIsLoggedIn() {
    const isUserLogged = this.tokenService.verifyIfIsLogged();
    if (isUserLogged) {
      this.restoreUserFromToken();
      return true;
    }
    return false;
  }
}
