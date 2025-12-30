import {Component, inject, OnInit} from '@angular/core';
import {CountSelectorComponent} from '../../../common/count-selector/count-selector.component';
import {RouterLink} from '@angular/router';
import {CarouselModule, OwlOptions} from 'ngx-owl-carousel-o';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {ProductCartComponent} from '../../../common/product-cart/product-cart.component';
import {ProductType} from '../../../../../types/product.type';
import {ProductService} from '../../../../services/product.service';
import {BasketService} from '../../../../services/basket.service';
import {BasketType} from '../../../../../types/basket.type';
import {environment} from '../../../../../environments/environment.development';


@Component({
  selector: 'basket',
  standalone: true,
  imports: [
    CountSelectorComponent,
    RouterLink,
    CarouselModule,
    NgForOf,
    ProductCartComponent,
    NgIf,
    NgStyle,
  ],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss'
})
export class BasketComponent implements OnInit {
  private ProductService = inject(ProductService);
  private BasketService = inject(BasketService);
  readonly environment = environment.serverStaticPath;
  extraProducts: ProductType[] = [];
  basket: BasketType | null = null;
  totalAmount: number = 0;
  totalCount: number = 0;


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

  ngOnInit() {
    this.ProductService.getBestProducts().subscribe((products: ProductType[]) => {
      this.extraProducts = products;
    })

    this.BasketService.getBasket().subscribe((data: BasketType) => {
      this.basket = data;
      this.calculateTotal();
    })


  }

  calculateTotal() {
    if (this.basket) {
      this.totalAmount = 0;
      this.totalCount = 0;
      this.basket.items.forEach(item => {
        this.totalAmount += item.product.price * item.quantity;
        this.totalCount += item.quantity;
      })
    }
  }

  updateCount(id: string, value: number) {
    if(this.basket) {
      this.BasketService.updateBasket(id, value)
        .subscribe(data => {
          this.basket = data;
          this.calculateTotal();
      })
    }
  }

}
