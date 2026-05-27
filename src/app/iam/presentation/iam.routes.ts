import {Routes} from '@angular/router';

const signInForm = () => import('./views/sign-in-form/sign-in-form').then(m => m.SignInForm);
const signUpForm = () => import('./views/sign-up-form/sign-up-form').then(m => m.SignUpForm);
const forgotPasswordForm = () => import('./views/forgot-password-form/forgot-password-form').then(m => m.ForgotPasswordForm);

export const iamRoutes: Routes = [
  {path: 'sign-in', loadComponent: signInForm, title: 'Sign In - ParkingNow'},
  {path: 'sign-up', loadComponent: signUpForm, title: 'Sign Up - ParkingNow'},
  {path: 'forgot-password', loadComponent: forgotPasswordForm, title: 'Forgot Password - ParkingNow'},
  {path: '', redirectTo: 'sign-in', pathMatch: 'full'}
];
