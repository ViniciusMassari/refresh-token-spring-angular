import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { JWTLoginPayload } from '../../types/login';
@Injectable({ providedIn: 'root' })
export class TokenService {
  readonly #TOKEN_NAME = '@app_refresh:v1';
  saveToken(token: string) {
    localStorage.setItem(this.#TOKEN_NAME, token);
  }

  getToken() {
    return localStorage.getItem(this.#TOKEN_NAME);
  }

  decodeToken(token: string): JWTLoginPayload {
    return jwtDecode(token);
  }

  removeToken() {
    localStorage.removeItem(this.#TOKEN_NAME);
  }

  verifyIfIsLogged() {
    const token = this.getToken();
    if (!token) return false;
    const isTokenExpired = this.isTokenExpired(token);
    if (token && !isTokenExpired) {
      return true;
    }

    return false;
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      const expiration = decoded.exp;
      if (expiration) {
        return expiration < now;
      }
      return false;
    } catch (err) {
      console.error('Token inválido:', err);
      return false;
    }
  }
}
