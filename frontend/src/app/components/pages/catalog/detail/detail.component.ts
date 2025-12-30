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
  products: ProductType[] = [];
  product!: ProductType;
  count: number = 1;
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

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.ProductService.getProduct(params['url'])
        .subscribe((product:ProductType) => {
          this.BasketService.getBasket()
            .subscribe((data: BasketType) => {
              if(data) {
                const productInBasket = data.items.find(item => item.product.id === product.id);
                if(productInBasket) {
                  product.countInBasket = productInBasket.quantity;
                  this.count = product.countInBasket;
                }
              }
              this.product = product;
            })
        })
    })

    this.ProductService.getBestProducts().subscribe((products:ProductType[]) => {
      this.products = products;
    })
  }

  updateCount(value: number) {
    this.count = value;
    if (this.product.countInBasket) {
      this.BasketService.updateBasket(this.product.id, this.count)
        .subscribe(data => {
          this.product.countInBasket = this.count;
        })
    }
  }

  addToCart(): void {
    this.BasketService.updateBasket(this.product.id, this.count)
      .subscribe(data => {
        this.product.countInBasket = this.count;
      })
  }

  removeFromBasket() {
    this.BasketService.updateBasket(this.product.id, 0)
      .subscribe(data => {
        this.product.countInBasket = 0;
        this.count = 1;
      })
  }
}


