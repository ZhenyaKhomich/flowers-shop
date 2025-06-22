import {Component, inject, OnInit} from '@angular/core';
import {FavoriteService} from '../../../../services/favorite.service';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {FavoriteType} from '../../../../../types/favorite.type';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {environment} from '../../../../../environments/environment.development';
import {RouterLink} from '@angular/router';
import {ProductType} from '../../../../../types/product.type';
import {BasketType} from '../../../../../types/basket.type';
import {BasketService} from '../../../../services/basket.service';
import {CountSelectorComponent} from '../../../common/count-selector/count-selector.component';

@Component({
  selector: 'favorite',
  standalone: true,
  imports: [
    NgForOf,
    NgStyle,
    RouterLink,
    NgIf,
    CountSelectorComponent
  ],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {
  private FavoriteService = inject(FavoriteService);
  private BasketService = inject(BasketService);
  readonly environment = environment.serverStaticPath;
  products: FavoriteType[] = [];
  count: number = 1;
  basket: BasketType | null = null;

  ngOnInit() {
    this.BasketService.getBasket().subscribe((data: BasketType | DefaultResponseType) => {
      if((data as DefaultResponseType).error !== undefined) {
        const error = (data as DefaultResponseType).message;
        throw new Error(error);
      }
      this.basket = data as BasketType;

      this.FavoriteService.getFavorites().subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }
        this.products = data as ProductType[];
        this.products = (data as FavoriteType[]).map((item) => {
          const elemInBasket = this.basket?.items?.filter(el => el.product.id === item.id);
          if(elemInBasket && elemInBasket.length > 0) {
            item.inBasket = true;
            item.quantity = elemInBasket[0].quantity;
          }

          return item;
        });
      })
    })
  }

  removeFromFavorites(id: string) {
    this.FavoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if(data.error) {
          console.error(data.message);
          throw Error(data.message);
        }
        this.products = this.products.filter((product) => product.id !== id);
      })
  }

  addToBasket(id: string, count: number) {
    this.count = count;
    this.BasketService.updateBasket(id, this.count)
      .subscribe((data: BasketType | DefaultResponseType) => {
        if((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }
        this.products = this.products.map((item) => {
          if(item.id === id) {
            item.inBasket = true;
          }
          return item;
        })
      })
  }

  updateCount(value: number, id: string) {
    this.count = value;
      this.BasketService.updateBasket(id, this.count)
        .subscribe((data: BasketType | DefaultResponseType) => {
          if((data as DefaultResponseType).error !== undefined) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }
          if(value === 0) {
            this.products = this.products.map((product) => {
            if(product.id === id) {
              product.inBasket = false;
            }
              return product;
            });
          }
        })
  }
}
