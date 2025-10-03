import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {LoginResponseType} from '../../types/login-response.type';
import {Observable, Subject, throwError} from 'rxjs';
import {DefaultResponseType} from '../../types/default-response.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private isLogged: boolean = false;
  isLogged$: Subject<boolean> = new Subject<boolean>();
  accessTokenKey: string = 'accessToken';
  refreshTokenKey: string = 'refreshToken';
  userIdKey: string = 'userId';

  constructor() {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey)
  }

  getIsLoggedIn() {
    return this.isLogged;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  getTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    }
  }

  get userId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  set userId(userId: string | null) {
    if (userId !== null) {
      localStorage.setItem(this.userIdKey, userId);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  login(body: {
    email: string,
    password: string,
    rememberMe: boolean
  }): Observable<LoginResponseType | DefaultResponseType> {
    return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'login', body)
  }

  signup(email: string, password: string, passwordRepeat: string): Observable<LoginResponseType | DefaultResponseType> {
    return this.http.post<LoginResponseType | DefaultResponseType>(environment.api + 'signup', {email, password, passwordRepeat})
  }

  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {refreshToken: tokens.refreshToken})
    } else {
      throw throwError(() => 'Can not find tokens');
    }
  }




}
