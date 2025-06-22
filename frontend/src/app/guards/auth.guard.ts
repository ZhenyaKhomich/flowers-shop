import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const snakeBar = inject(MatSnackBar);

  if(authService.getIsLoggedIn()) {
    return true;
  }

  snakeBar.open('Для доступа необходимо зарегистрироваться/войти', '', {duration: 3000})
  return false;
};
