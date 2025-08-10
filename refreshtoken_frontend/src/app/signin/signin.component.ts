import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SigninFormService } from './signin-form.service';
import { ErrorMsgComponent } from '../../shared/error/error.component';
import { AuthService } from '../../shared/auth/auth.service';
import { SignInInfo } from '../../types/signIn';
import { Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule, ErrorMsgComponent, RouterLink],
  templateUrl: './signin.component.html',
})
export class SigninComponent {
  formService = inject(SigninFormService);
  authService = inject(AuthService);
  router = inject(Router);

  errorMessage = signal('');

  signInUser() {
    const form = this.formService.form;

    if (form.invalid) {
      return;
    }

    this.authService
      .signInUser(form.value as SignInInfo)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.router.navigate(['login']);
          this.errorMessage.set('');
        },
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            this.errorMessage.set(
              `It was not possible to complete your signin, verify if your user already exists or try again later ${err.message} ${err.status}`
            );
          }
        },
      });
  }
}
