import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgStyle} from '@angular/common';
import {AuthService} from '../../../services/auth.service';
import {LoginResponseType} from '../../../../types/login-response.type';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgStyle,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private AuthService = inject(AuthService);
  private snakeBar = inject(MatSnackBar);
  private router = inject(Router);
  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    })
  }

  login(): void {
    if(this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.AuthService.login({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        rememberMe: this.loginForm.value.rememberMe
      }).subscribe({
        next: (data: LoginResponseType | DefaultResponseType) => {
          let error = null;
          if((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }

          const loginResponse = data as LoginResponseType;
          if(!loginResponse.accessToken ||
            !loginResponse.refreshToken ||
            !loginResponse.userId) {
            error = 'Ошибка авторизации';
          }

          if(error) {
            this.snakeBar.open(error, '', {duration: 3000});
            throw new Error(error);
          }

          this.AuthService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
          this.AuthService.userId = loginResponse.userId;
          this.snakeBar.open('Вы успешно авторизовались', '', {duration: 3000});
          this.router.navigate(['/']);
          this.snakeBar.open('Авторизация прошла успешно', '', {duration: 3000})
        },
        error: (error: HttpErrorResponse) => {
          if(error.error && error.error.message) {
            this.snakeBar.open(error.error.message, '', {duration: 3000})
          } else {
            this.snakeBar.open('Ошибка авторизации', '', {duration: 3000})
          }
        }
      })
    }
  }
}
