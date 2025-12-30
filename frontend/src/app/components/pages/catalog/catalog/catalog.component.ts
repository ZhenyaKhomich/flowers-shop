import {Component, inject, OnInit} from '@angular/core';
import {ProductCartComponent} from '../../../common/product-cart/product-cart.component';
import {ProductService} from '../../../../services/product.service';
import {ProductType} from '../../../../../types/product.type';
import {NgForOf, NgIf} from '@angular/common';
import {debounceTime} from 'rxjs';
import {CategoryService} from '../../../../services/category.service';
import {HttpErrorResponse} from '@angular/common/http';
import {CategoryWithTypeType} from '../../../../../types/category-with-type.type';
import {CategoryFilterComponent} from '../../../common/category-filter/category-filter.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ActiveParamsUtil} from '../../../../utils/active-params.util';
import {ActiveParamsType} from '../../../../../types/active-params.type';
import {AppliedFilterType} from '../../../../../types/appliedFilter.type';
import {BasketService} from '../../../../services/basket.service';
import {BasketType} from '../../../../../types/basket.type';

@Component({
  selector: 'catalog',
  standalone: true,
  imports: [
    ProductCartComponent,
    NgForOf,
    CategoryFilterComponent,
    NgIf
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})

export class CatalogComponent implements OnInit {

  private ProductsService = inject(ProductService);
  private CategoryService = inject(CategoryService);
  private BasketService = inject(BasketService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  products: ProductType[] = [];
  categoriesWithTypes: CategoryWithTypeType[] = [];
  activeParams: ActiveParamsType = {types: []};
  appliedFilters: AppliedFilterType[] = [];
  sortingOpen: boolean = false;
  sortingOptions: { name: string; value: string }[] = [
    {name: 'От А до Я', value: 'az-asc'},
    {name: 'От Я до А', value: 'az-desc'},
    {name: 'По возрастанию цены', value: 'price-asc'},
    {name: 'По убыванию цены', value: 'price-desc'}
  ];
  pages: number[] = [];
  noFound: boolean = false;
  basket: BasketType | null = null;

  ngOnInit(): void {
    this.BasketService.getBasket().subscribe((data: BasketType) => {
      this.basket = data;
    })
    this.CategoryService.getCategoriesWithTypes().subscribe({
      next: (categories) => {
        if (categories && categories.length > 0) {
          this.categoriesWithTypes = categories;

          this.activatedRoute.queryParams
            .pipe(
              debounceTime(500),
            ).subscribe((params) => {
            this.activeParams = ActiveParamsUtil.processParams(params);
            this.appliedFilters = [];

            this.activeParams.types.forEach(url => {
              for (let i = 0; i < this.categoriesWithTypes.length; i++) {
                const foundType = this.categoriesWithTypes[i].types.find(type => type.url === url);
                if (foundType) {
                  this.appliedFilters.push({
                    name: foundType.name,
                    urlParams: url
                  })
                }
              }
            });

            if (this.activeParams.heightFrom) {
              this.appliedFilters.push({
                name: 'Высота: от ' + this.activeParams.heightFrom + ' см',
                urlParams: 'heightFrom'
              })
            }

            if (this.activeParams.heightTo) {
              this.appliedFilters.push({
                name: 'Высота: до ' + this.activeParams.heightTo + ' см',
                urlParams: 'heightTo'
              })
            }

            if (this.activeParams.diameterFrom) {
              this.appliedFilters.push({
                name: 'Диаметр: от ' + this.activeParams.diameterFrom + ' см',
                urlParams: 'diameterFrom'
              })
            }

            if (this.activeParams.diameterTo) {
              this.appliedFilters.push({
                name: 'Диаметр: до ' + this.activeParams.diameterTo + ' см',
                urlParams: 'diameterTo'
              })
            }

            this.ProductsService.getProducts(this.activeParams).subscribe({
              next: (products) => {
                if (products.items && products.items.length > 0) {
                  this.pages = [];
                  for (let i = 1; i <= products.pages; i++) {
                    this.pages.push(i);
                  }
                  if(this.basket && this.basket.items.length > 0) {
                    this.products = products.items.map((product) => {
                      const productInBasket = this.basket?.items.find((item) => {
                        return item.product.id === product.id;
                      })
                      if(productInBasket) {
                        product.countInBasket = productInBasket.quantity;
                      }
                      return product;
                    });
                  } else {
                    this.products = products.items;
                  }
                  this.noFound = false;
                } else {
                  this.products = [];
                  this.noFound = true;
                }
              },
              error: (error: HttpErrorResponse) => {
                console.log(error);
              }
            })
          })
        } else {
          console.log('Ошибка при получении категорий');
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    if (appliedFilter.urlParams === 'heightFrom' || appliedFilter.urlParams === 'heightTo' ||
      appliedFilter.urlParams === 'diameterFrom' || appliedFilter.urlParams === 'diameterTo') {
      delete this.activeParams[appliedFilter.urlParams];
    } else {
      this.activeParams.types = this.activeParams.types.filter(type => type !== appliedFilter.urlParams);
    }
    this.activeParams.page = 1;
    this.router.navigate(['/catalog'], {queryParams: this.activeParams});
  }

  toggleSorting(): void {
    this.sortingOpen = !this.sortingOpen;
  }

  sort(value: string): void {
    this.activeParams.sort = value;
    this.router.navigate(['/catalog'], {queryParams: this.activeParams});
  }

  openPage(page: number): void {
    this.activeParams.page = page;
    this.router.navigate(['/catalog'], {queryParams: this.activeParams});
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page -= 1;
      this.router.navigate(['/catalog'], {queryParams: this.activeParams});
    }

  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page += 1;
      this.router.navigate(['/catalog'], {queryParams: this.activeParams});
    }
  }
}
