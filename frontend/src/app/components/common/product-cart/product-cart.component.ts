import {Component, inject, Input, OnInit,} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ProductType} from '../../../../types/product.type';
import {CurrencyPipe, NgIf, NgStyle} from '@angular/common';
import {environment} from '../../../../environments/environment';
import {FormsModule} from '@angular/forms';
import {CountSelectorComponent} from '../count-selector/count-selector.component';
import {BasketService} from '../../../services/basket.service';


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
  private router = inject(Router);
  readonly environment = environment.serverStaticPath;
  @Input() product!: ProductType;
  @Input() isLight: boolean = false;
  @Input() countInBasket: number = 0;
  count: number = 1;


  ngOnInit() {
    if (this.countInBasket) {
      this.count = this.countInBasket;
    }
  }

  addToCart() {
    this.BasketService.updateBasket(this.product.id, this.count)
      .subscribe(data => {
        this.countInBasket = this.count;
      })
  }

  updateCount(value: number) {
    this.count = value;
    if (this.countInBasket) {
      this.BasketService.updateBasket(this.product.id, this.count)
        .subscribe(data => {
          this.countInBasket = this.count;
        })
    }
  }

  removeFromBasket() {
    this.BasketService.updateBasket(this.product.id, 0)
      .subscribe(data => {
        this.countInBasket = 0;
        this.count = 1;
      })
  }

  clickToCart(url: string) {
    this.router.navigate(['/product/' + url]);
  }

}
