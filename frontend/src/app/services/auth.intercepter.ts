import {HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {catchError, switchMap, throwError, finalize} from 'rxjs';
import {LoginResponseType} from '../../types/login-response.type';
import {DefaultResponseType} from '../../types/default-response.type';
import {Router} from '@angular/router';
import {LoaderService} from './loader.service';


export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const loaderService = inject(LoaderService);
  const tokens = authService.getTokens();

  loaderService.show();

  if (tokens && tokens.accessToken) {
    const newReq = req.clone({
      setHeaders: {'x-access-token': tokens.accessToken}
    });
    return next(newReq).pipe(
      catchError((err) => {
        if (err.status === 401 && !newReq.url.includes('login') &&
          !newReq.url.includes('signup') &&
          !newReq.url.includes('refresh')) {
          return handle401Error(newReq, next);
        }
        return throwError(() => err);
      }),
      finalize(() => {
        loaderService.hide();
      })
    );
  }
  return next(req).pipe(
    finalize(() => {
      loaderService.hide();
    })
  );
};

function handle401Error(req: HttpRequest<any>, next: HttpHandlerFn) {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.refresh()
    .pipe(
      switchMap((result: LoginResponseType | DefaultResponseType) => {
        let error = '';
        if((result as DefaultResponseType).error !== undefined) {
          error = (result as DefaultResponseType).message;
        }

        const refreshResult = (result as LoginResponseType);

        if(!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
          error = 'Ошибка авторизации';
        }

        if(error) {
          return throwError(()=> new Error(error));
        }

        authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);

        const newReq = req.clone({
          setHeaders: {'x-access-token': refreshResult.accessToken }
        });

        return next(newReq);
      }),
      catchError((err) => {
        authService.removeTokens();
        router.navigate(['/']);
        return throwError(() => err);
      })
    )
}
