import {Component, inject, OnInit} from '@angular/core';
import {ProductCartComponent} from '../../../common/product-cart/product-cart.component';
import {ProductService} from '../../../../services/product.service';
import {ProductType} from '../../../../../types/product.type';
import {NgForOf} from '@angular/common';
import {throwError} from 'rxjs';
import {CategoryService} from '../../../../services/category.service';
import {HttpErrorResponse} from '@angular/common/http';
import {CategoryWithTypeType} from '../../../../../types/category-with-type.type';
import {CategoryFilterComponent} from '../../../common/category-filter/category-filter.component';

@Component({
  selector: 'catalog',
  standalone: true,
  imports: [
    ProductCartComponent,
    NgForOf,
    CategoryFilterComponent
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {

  private ProductsService = inject(ProductService);
  private CategoryService = inject(CategoryService);
  products: ProductType[] = [];
  categoriesWithTypes: CategoryWithTypeType[] = [];

  ngOnInit(): void {
    this.ProductsService.getProducts().subscribe({
      next: (products) => {
        if(products.items && products.items.length > 0) {
          this.products = products.items;
        } else {
          console.log('Ошибка при получении данных');
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })

    this.CategoryService.getCategoriesWithTypes().subscribe({
      next: (categories) => {
        if(categories && categories.length > 0) {
          this.categoriesWithTypes = categories;
          console.log(categories);
        } else {
          console.log('Ошибка при получении категорий');
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

}
