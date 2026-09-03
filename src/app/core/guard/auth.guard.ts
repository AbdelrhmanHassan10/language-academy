import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { AuthDialogService } from '../service/auth-dialog.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const authDialog = inject(AuthDialogService);

  if (auth.isAuthenticated()) {
    return true;
  }

  authDialog.openLogin();
  return router.createUrlTree(['/']);
};
