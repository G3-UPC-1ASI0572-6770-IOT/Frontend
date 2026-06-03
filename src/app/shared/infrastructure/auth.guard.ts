import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {IamStore} from '../../iam/application/iam.store';

export const authGuard = () => {
  const store = inject(IamStore);
  const router = inject(Router);
  if (store.isAuthenticated()) return true;
  return router.createUrlTree(['/iam/sign-in']);
};
