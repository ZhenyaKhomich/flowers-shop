import {Component, inject, Input, OnInit,} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ProductType} from '../../../../types/product.type';
import {CurrencyPipe, NgIf, NgStyle} from '@angular/common';
import {environment} from '../../../../environments/environment';
import {FormsModule} from '@angular/forms';
import {CountSelectorComponent} from '../count-selector/count-selector.component';
import {BasketService} from '../../../services/basket.service';
import {DefaultResponseType} from '../../../../types/default-response.type';
import {FavoriteType} from '../../../../types/favorite.type';
import {AuthService} from '../../../services/auth.service';
import {FavoriteService} from '../../../services/favorite.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BasketType} from '../../../../types/basket.type';


@Component({
  selector: 'product-cart',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    NgIf,
    FormsModule,
    CountSelectorComponent,
    NgStyle
  ],
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.scss'
})
export class ProductCartComponent implements OnInit {
  private BasketService = inject(BasketService);
  private AuthService = inject(AuthService);
  private FavoriteService = inject(FavoriteService);
  private router = inject(Router);
  private snakeBar = inject(MatSnackBar);
  readonly environment = environment.serverStaticPath;
  isLoggedIn: boolean = false;
  @Input() product!: ProductType;
  @Input() isLight: boolean = false;
  @Input() countInBasket: number = 0;
  count: number = 1;

  constructor() {
    this.isLoggedIn = this.AuthService.getIsLoggedIn();
  }

  ngOnInit() {
    if (this.countInBasket) {
      this.count = this.countInBasket;
    }
  }

  addToCart() {
    this.BasketService.updateBasket(this.product.id, this.count)
      .subscribe((data: BasketType | DefaultResponseType) => {
        if((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }
        this.countInBasket = this.count;
      })
  }

  updateCount(value: number) {
    this.count = value;
    if (this.countInBasket) {
      this.BasketService.updateBasket(this.product.id, this.count)
        .subscribe((data: BasketType | DefaultResponseType) => {
          if((data as DefaultResponseType).error !== undefined) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }
          this.countInBasket = this.count;
        })
    }
  }

  removeFromBasket() {
    this.BasketService.updateBasket(this.product.id, 0)
      .subscribe((data: BasketType | DefaultResponseType) => {
        if((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }
        this.countInBasket = 0;
        this.count = 1;
      })
  }

  clickToCart(url: string) {
    if(this.isLight) {
      this.router.navigate(['/product/' + url]);
    }
  }

  updateFavorite(id: string) {
    if (this.AuthService.getIsLoggedIn()) {
      if (this.product.isInFavorite) {
        this.FavoriteService.removeFavorite(id)
          .subscribe((data: DefaultResponseType) => {
            if (data.error) {
              throw new Error(data.message)
            }
            this.product.isInFavorite = false;
          })
      } else {
        this.FavoriteService.addFavorite(id)
          .subscribe((data: FavoriteType[] | DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error((data as DefaultResponseType).message)
            }
            this.product.isInFavorite = true;
          })
      }
    } else {
      this.snakeBar.open('Необходимо авторизоваться', '', {duration: 3000})
    }
  }
}
