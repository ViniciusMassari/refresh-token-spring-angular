import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import { ProfileService } from './profile.service';
import { catchError, delay, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  authService = inject(AuthService);
  #profileService = inject(ProfileService);
  public status = 0;
  getResource() {
    this.#profileService
      .getResource()
      .pipe(delay(500), catchError(this.httpError.bind(this)))
      .subscribe((response) => {
        this.status = response.status;
        console.log(response.status);
      });
  }

  httpError(error: HttpErrorResponse) {
    console.log('erro função httpError dentro do componente');
    console.log(error.status);

    return of();
  }
}
