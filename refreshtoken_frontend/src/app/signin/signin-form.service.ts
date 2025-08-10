import { inject, Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormValidation } from '../../shared/FormValidation';
export interface SignInForm {
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}
@Injectable({
  providedIn: 'root',
})
export class SigninFormService {
  private formBuilder = inject(FormBuilder);
  form: FormGroup<SignInForm> = this.formBuilder.nonNullable.group({
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
