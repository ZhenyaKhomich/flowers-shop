import {Component, HostListener, inject, Input, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatMenuModule} from '@angular/material/menu';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CategoryWithTypeType} from '../../../../types/category-with-type.type';
import {BasketService} from '../../../services/basket.service';
import {debounceTime} from 'rxjs';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProductService} from '../../../services/product.service';
import {ProductType} from '../../../../types/product.type';
import {environment} from '../../../../environments/environment.development';


@Component({
  selector: 'header-component',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    NgIf,
    MatMenuModule,
    FormsModule,
    NgStyle,
    ReactiveFormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent implements OnInit {
  private AuthService = inject(AuthService);
  private BasketService = inject(BasketService);
  private ProductService = inject(ProductService);
  private snakeBar = inject(MatSnackBar);
  private router = inject(Router);
  protected readonly environment = environment.serverStaticPath;
  searchField = new FormControl();
  @Input() categories: CategoryWithTypeType[] = [];
  products: ProductType[] = [];
  showedSearch: boolean = false;
  isLoggedIn: boolean = false;
  count: number = 0;

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if(this.showedSearch && (event.target as HTMLElement).className.indexOf('search-product') === -1) {
      this.showedSearch = false;
    }
  }

  constructor() {
    this.isLoggedIn = this.AuthService.getIsLoggedIn();
  }

  ngOnInit() {
    this.searchField.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {
        if (value && value.length > 2) {
              this.ProductService.searchProducts(value)
                .subscribe((data: ProductType[]) => {
               this.products = data;
               this.showedSearch = true;
              })
            } else {
              this.products = [];
            }
      })

    this.BasketService.count$.subscribe(count => {
      this.count = count;
    })
    this.AuthService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    })

    this.BasketService.getBasketCount()
      .subscribe((data: { count: number } | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }
        this.count = (data as { count: number }).count;
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

  selectProduct(url: string) {
    this.router.navigate(['/product/', url]);
    this.products = [];
    this.searchField.setValue('');
  }
}
