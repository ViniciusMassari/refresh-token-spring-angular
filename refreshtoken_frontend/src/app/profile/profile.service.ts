import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TokenService } from '../../shared/auth/token.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  #http = inject(HttpClient);
  #tokenService = inject(TokenService);
  getResource() {
    const token = this.#tokenService.getToken();
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });

    console.log(headers);

    return this.#http.get('/api/user/get-resource', {
      headers,
      observe: 'response',
      withCredentials: true,
    });
  }
}
