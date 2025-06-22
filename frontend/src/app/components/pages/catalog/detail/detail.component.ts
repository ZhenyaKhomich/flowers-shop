import {Component, inject, Input, OnInit} from '@angular/core';
import {CarouselModule, OwlOptions} from 'ngx-owl-carousel-o';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {ProductCartComponent} from '../../../common/product-cart/product-cart.component';
import {ProductType} from '../../../../../types/product.type';
import {ProductService} from '../../../../services/product.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {CountSelectorComponent} from '../../../common/count-selector/count-selector.component';
import {BasketService} from '../../../../services/basket.service';
import {BasketType} from '../../../../../types/basket.type';
import {FavoriteService} from '../../../../services/favorite.service';
import {FavoriteType} from '../../../../../types/favorite.type';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {AuthService} from '../../../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'detail',
  standalone: true,
  imports: [
    CarouselModule,
    NgForOf,
    ProductCartComponent,
    NgIf,
    CountSelectorComponent,
    NgStyle
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  private ProductService = inject(ProductService);
  private activatedRoute = inject(ActivatedRoute);
  private BasketService = inject(BasketService);
  private FavoriteService = inject(FavoriteService);
  private AuthService = inject(AuthService);
  private snakeBar = inject(MatSnackBar);
  products: ProductType[] = [];
  product!: ProductType;
  count: number = 1;
  isLoggedIn: boolean = false;
  readonly environment = environment.serverStaticPath;
  customOptions: OwlOptions = {
    loop: true,
    margin: 24,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  }

  constructor() {
    this.isLoggedIn = this.AuthService.getIsLoggedIn();
  }


  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.ProductService.getProduct(params['url'])
        .subscribe((product: ProductType) => {
          this.product = product;

          this.BasketService.getBasket()
            .subscribe((data: BasketType | DefaultResponseType) => {
              if((data as DefaultResponseType).error !== undefined) {
                const error = (data as DefaultResponseType).message;
                throw new Error(error);
              }
              if (data) {
                const productInBasket = (data as BasketType).items.find(item => item.product.id === this.product.id);
                if (productInBasket) {
                  this.product.countInBasket = productInBasket.quantity;
                  this.count = this.product.countInBasket;
                }
              }
            })

          if (this.AuthService.getIsLoggedIn()) {
            this.FavoriteService.getFavorites().subscribe((data: FavoriteType[] | DefaultResponseType) => {
              if ((data as DefaultResponseType).error !== undefined) {
                const error = (data as DefaultResponseType).message;
                throw new Error(error);
              }

              const products = data as FavoriteType[];
              const currentProductExists = products.find((product) => product.id === this.product.id);
              if (currentProductExists) {
                this.product.isInFavorite = true;
              }
            })
          }
        })
    })

    this.ProductService.getBestProducts().subscribe((products: ProductType[]) => {
      this.products = products;
    })
  }

  updateCount(value: number) {
    this.count = value;
    if (this.product.countInBasket) {
      this.BasketService.updateBasket(this.product.id, this.count)
        .subscribe((data: BasketType | DefaultResponseType) => {
          if((data as DefaultResponseType).error !== undefined) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }
          this.product.countInBasket = this.count;
        })
    }
  }

  addToCart(): void {
    this.BasketService.updateBasket(this.product.id, this.count)
      .subscribe((data: BasketType | DefaultResponseType) => {
        if((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }
        this.product.countInBasket = this.count;
      })
  }

  removeFromBasket() {
    this.BasketService.updateBasket(this.product.id, 0)
      .subscribe((data: BasketType | DefaultResponseType) => {
        if((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }
        this.product.countInBasket = 0;
        this.count = 1;
      })
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


