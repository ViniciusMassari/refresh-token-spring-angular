import { inject } from '@angular/core';
import { SignInForm, SigninFormService } from './signin-form.service';
import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormGroup } from '@angular/forms';

describe('SigninFormService', () => {
  let signinFormService: SigninFormService;
  let form: FormGroup<SignInForm>;

  beforeAll(() => {
    TestBed.configureTestingModule({ providers: [SigninFormService] });
    signinFormService = TestBed.inject(SigninFormService);

    form = signinFormService.form;
  });
  it('Form should not be undefined', () => {
    expect(signinFormService.form).not.toBe(undefined);
  });

  it('Form should be invalid', () => {
    expect(form.invalid).toBeTruthy();
  });
  it('Form should be valid', () => {
    const email = form.get('email');
    email?.setValue('valid@email.com');
    const username = form.get('username');
    username?.setValue('validUsername');
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    password?.setValue('12345678');
    confirmPassword?.setValue('12345678');
    expect(form.valid).toBeTruthy();
  });

  it('Form should have email, password, username and confirmPassword controls', () => {
    const email = form.get('email');
    const username = form.get('username');
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    expect(email).toBeTruthy();
    expect(username).toBeTruthy();
    expect(password).toBeTruthy();
    expect(confirmPassword).toBeTruthy();
  });

  describe('Email control tests', () => {
    it('Email control should have an error', () => {
      const email = form.get('email');
      email?.setValue('invalidEmail.com');
      expect(email?.errors).toHaveProperty('email');
    });
    it('Email should be valid', () => {
      const email = form.get('email');
      email?.setValue('validEmail@email.com');
      expect(email?.valid).toBe(true);
    });
    it('Email should have required error', () => {
      const email = form.get('email');
      email?.setValue('');
      expect(email?.errors).toHaveProperty('required');
    });
  });

  describe('Username control tests', () => {
    let username: AbstractControl<any, any> | null;

    beforeAll(() => {
      username = form.get('username');
    });
    it('Username should not be valid', () => {
      username?.setValue('username with spaces');
      expect(username?.errors).toHaveProperty('pattern');
    });

    it('Username control should have required error', () => {
      username?.setValue('');
      expect(username?.errors).toHaveProperty('required');
    });

    it('Username should be valid', () => {
      username?.setValue('goodUsername');
      expect(username?.valid).toBeTruthy();
    });
  });

  describe('Password and confirmPassword tests', () => {
    let password: AbstractControl<string, string> | null;
    let confirmPassword: AbstractControl<string, string> | null;

    beforeAll(() => {
      password = form.get('password');
      confirmPassword = form.get('confirmPassword');
    });

    it('Password control should have minLength error', () => {
      password?.setValue('123456');
      expect(password?.errors).toHaveProperty('minlength');
    });
    it('ConfirmPassword control should have minLength error', () => {
      confirmPassword?.setValue('123456');
      expect(confirmPassword?.errors).toHaveProperty('minlength');
    });

    it('Password control should have required error', () => {
      password?.setValue('');
      expect(password?.errors).toHaveProperty('required');
    });
    it('ConfirmPassword control should have required error', () => {
      confirmPassword?.setValue('');
      expect(confirmPassword?.errors).toHaveProperty('required');
    });

    it('ConfirmPassword should not be equal password control value', () => {
      password?.setValue('12345678');
      confirmPassword?.setValue('12345610');

      expect(confirmPassword?.errors).toHaveProperty('equalsTo');
    });
    it('ConfirmPassword should be equal password control value', () => {
      const passwordValue = '12345678';
      password?.setValue(passwordValue);
      confirmPassword?.setValue(passwordValue);

      expect(confirmPassword?.valid).toBeTruthy();
    });

    it('Password should be valid', () => {
      password?.setValue('12345678');
      expect(password?.valid).toBeTruthy();
    });
  });
});
