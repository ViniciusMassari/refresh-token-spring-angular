import { TestBed } from '@angular/core/testing';
import { LoginFormService } from './login-form.service';
import { AbstractControl, FormGroup } from '@angular/forms';

describe('(unit) Login form tests', () => {
  let loginFormService: LoginFormService;
  let form: FormGroup;
  beforeAll(() => {
    TestBed.configureTestingModule({ providers: [LoginFormService] });
    loginFormService = TestBed.inject(LoginFormService);
    form = loginFormService.form;
  });

  it('Form should not be undefined', () => {
    expect(form).toBeTruthy();
  });

  it('Form should be invalid', () => {
    expect(form.invalid).toBeTruthy();
  });

  it('Form should have username and password controls', () => {
    const username = form.get('username');
    const password = form.get('password');

    expect(username).toBeTruthy();
    expect(password).toBeTruthy();
  });

  it('Form should be valid', () => {
    const username = form.get('username');
    username?.setValue('validUsername');
    const password = form.get('password');
    password?.setValue('12345678');
    expect(form.valid).toBeTruthy();
  });

  describe('(unit) username control tests', () => {
    let username: AbstractControl<string, string> | null;

    beforeAll(() => {
      username = form.get('username');
    });
    it('Username control should be invalid', () => {
      username?.setValue('');
      expect(username?.invalid).toBeTruthy();
    });
    it('Username control should have required error', () => {
      username?.setValue('');
      expect(username?.hasError('required')).toBeTruthy();
    });
    it('Username control should have minlength error', () => {
      username?.setValue('ab');
      expect(username?.hasError('minlength')).toBeTruthy();
    });
    it('Username control should not match pattern', () => {
      username?.setValue('invalid username');
      expect(username?.hasError('pattern')).toBeTruthy();
    });

    it('Username control should be valid', () => {
      username?.setValue('validUsername');
      expect(username?.valid).toBeTruthy();
    });
  });

  describe('', () => {
    let password: AbstractControl<string, string> | null;

    beforeAll(() => {
      password = form.get('password');
    });

    it('Password control should be invalid', () => {
      password?.setValue('');
      expect(password?.invalid).toBeTruthy();
    });

    it('Password control should have required error', () => {
      password?.setValue('');
      expect(password?.errors).toHaveProperty('required');
    });

    it('Username control should be valid', () => {
      password?.setValue('12345678');
      expect(password?.valid).toBeTruthy();
    });
  });
});
