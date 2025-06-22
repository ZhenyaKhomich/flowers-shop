import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgStyle} from '@angular/common';
import {PasswordRepeatDirective} from '../../../directives/password-repeat.directive';
import {AuthService} from '../../../services/auth.service';
import {LoginResponseType} from '../../../../types/login-response.type';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgStyle,
    PasswordRepeatDirective
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})

export class SignupComponent implements OnInit {
  private fb = inject(FormBuilder);
  private AuthService = inject(AuthService);
  private snakeBar = inject(MatSnackBar);
  private router = inject(Router);
  signupForm!: FormGroup;

  ngOnInit() {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d]{8,}$/)]],
      passwordRepeat: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d]{8,}$/)]],
      agree: [false, Validators.requiredTrue],
    })
  }

  signup(): void {
    if(this.signupForm.valid && this.signupForm.value.email && this.signupForm.value.password &&
      this.signupForm.value.passwordRepeat && this.signupForm.value.agree) {
      this.AuthService.signup(
        this.signupForm.value.email,
        this.signupForm.value.password,
        this.signupForm.value.passwordRepeat).subscribe({
        next: (data: LoginResponseType | DefaultResponseType) => {
          let error = null;
          if((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }

          const loginResponse = data as LoginResponseType;
          if(!loginResponse.accessToken ||
            !loginResponse.refreshToken ||
            !loginResponse.userId) {
            error = 'Ошибка регистрации';
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
            this.snakeBar.open('Ошибка регистрации', '', {duration: 3000})
          }
        }
      })
    }
  }

}
