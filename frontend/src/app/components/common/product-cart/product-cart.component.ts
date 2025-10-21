import { Component, Input,} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ProductType} from '../../../../types/product.type';
import {CurrencyPipe, NgIf} from '@angular/common';
import {environment} from '../../../../environments/environment';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'product-cart',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    NgIf,
    FormsModule
  ],
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.scss'
})
export class ProductCartComponent {
  @Input() product!: ProductType;
  count:number = 1;
  readonly environment = environment.serverStaticPath;
}
