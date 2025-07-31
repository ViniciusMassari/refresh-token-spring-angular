import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { canActivateProfile } from './profile/profile.guard';
import { guestGuard } from '../shared/auth/guest.guard';

export const routes: Routes = [
  {
    path: '',
    component: SigninComponent,
    canActivate: [guestGuard],
  },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [canActivateProfile],
  },
];
