import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidation } from '../../shared/FormValidation';

@Injectable({
  providedIn: 'root',
})
export class SigninFormService {
  formBuilder = inject(FormBuilder);
  form!: FormGroup;
  init() {
    this.form = this.formBuilder.nonNullable.group({
      username: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]+$/),
          Validators.minLength(3),
        ],
      ],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          FormValidation.equalsTo('password'),
        ],
      ],
    });
  }
}
