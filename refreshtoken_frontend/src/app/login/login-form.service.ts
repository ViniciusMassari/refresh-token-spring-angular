import { inject, Inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class LoginFormService {
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
      password: ['', [Validators.required]],
    });
  }
}
