import {Component, inject, Input, OnInit} from '@angular/core';

import {NgForOf, NgIf} from '@angular/common';
import {CategoryType} from '../../../../types/category.type';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatMenuModule} from '@angular/material/menu';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CategoryWithTypeType} from '../../../../types/category-with-type.type';
import {BasketService} from '../../../services/basket.service';
import {Subject} from 'rxjs';


@Component({
  selector: 'header-component',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    NgIf,
    MatMenuModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent implements OnInit {
  private AuthService = inject(AuthService);
  private BasketService = inject(BasketService);
  private snakeBar = inject(MatSnackBar);
  private router = inject(Router);
  @Input() categories: CategoryWithTypeType[] = [];

  isLoggedIn: boolean = false;
  count: number = 0;


  constructor() {
    this.isLoggedIn = this.AuthService.getIsLoggedIn();
  }

  ngOnInit() {
    this.BasketService.count$.subscribe(count => {
      this.count = count;
    })
    this.AuthService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    })

    this.BasketService.getBasketCount()
      .subscribe(data => {
        this.count = data.count;
      })
  }

  logout(): void {
    this.AuthService.logout().subscribe({
      next: (response: DefaultResponseType) => {
        console.log(response);
        this.doLogout();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.doLogout();
      },
    })
  }

  doLogout(): void {
    this.AuthService.removeTokens();
    this.AuthService.userId = null;
    this.AuthService.isLogged$.next(false);
    this.snakeBar.open('Вы вышли из системы', '', {duration: 3000});
    this.router.navigate(['/']);
  }
}
