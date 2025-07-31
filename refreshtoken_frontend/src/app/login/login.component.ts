import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFormService } from './login-form.service';
import { ErrorMsgComponent } from '../../shared/error/error.component';
import { LoginRequestData } from '../../types/login';
import { catchError, take, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, ErrorMsgComponent],
  providers: [AuthService],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  formService = inject(LoginFormService);
  router = inject(Router);
  errorMessage = signal('');
  ngOnInit() {
    this.formService.init();
  }

  login() {
    const form = this.formService.form;
    if (form.invalid) return;
    this.authService
      .loginUser(form.value satisfies LoginRequestData)
      .pipe(take(1), catchError(this.handleError.bind(this)))
      .subscribe({
        next: (response) => {

          const jwt = response.body?.jwt;
          if (jwt) {

            this.authService.saveUserInfo(jwt);

            this.router.navigate(['profile']);
          }
        },
      });
  }

  handleError(e: HttpErrorResponse) {
    this.errorMessage.set(e.error.message);
    this.formService.form.reset();
    return throwError(() => {
      throw Error('Error during login');
    });
  }
}
