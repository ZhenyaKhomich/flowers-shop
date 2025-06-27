import {ProductCartComponent} from './product-cart.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {BasketService} from '../../../services/basket.service';
import {AuthService} from '../../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FavoriteService} from '../../../services/favorite.service';
import {of} from 'rxjs';
import {ProductType} from '../../../../types/product.type';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('product cart', () => {
  let fixture: ComponentFixture<ProductCartComponent>;
  let productCartComponent: ProductCartComponent;
  let product: ProductType;


  beforeEach(() => {
    const basketServiceSpy = jasmine.createSpyObj('BasketService', ['updateBasket']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getIsLoggedIn']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const _snakeBarSpy = jasmine.createSpyObj('MatSnakeBar', ['open']);
    const favoriteServiceSpy = jasmine.createSpyObj('FavoriteService', ['removeFavorite', 'addFavorite']);

    product = {
      id: 'test',
      name: 'test',
      price: 1,
      image: 'test',
      lightning:'test',
      humidity: 'test',
      temperature: 'test',
      height: 1,
      diameter: 1,
      url: 'test',
      type: {
        id: 'test',
        name: 'test',
        url: 'test',
      }
    }

    TestBed.configureTestingModule({
      imports: [ProductCartComponent],
      providers: [
        {provide: BasketService, useValue: basketServiceSpy},
        {provide: AuthService, useValue: authServiceSpy},
        {provide: Router, useValue: routerSpy},
        {provide: MatSnackBar, useValue: _snakeBarSpy},
        {provide: FavoriteService, useValue: favoriteServiceSpy},
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })

    fixture = TestBed.createComponent(ProductCartComponent);
    productCartComponent = fixture.componentInstance;
  })

  it('should have count init value 1', () => {
    productCartComponent.count = 1;
    expect(productCartComponent.count).toBe(1);
  })

  it('should set value from input countInBasket to count', () => {
    productCartComponent.countInBasket = 5;
    fixture.detectChanges();
    expect(productCartComponent.count).toBe(5);
  })

  it('should call removeFromBasket with count 0', () => {
    let cartServiceSpy = TestBed.inject(BasketService) as jasmine.SpyObj<BasketService>;

    cartServiceSpy.updateBasket.and.returnValue(of({
        items: [
          {
            product: {
              id: '1',
              name: '1',
              price: 1,
              image: '1',
              url: '1',
            },
            quantity: 1,
          }
        ]
      })
    );

    productCartComponent.product = product;
    productCartComponent.removeFromBasket();
    expect(cartServiceSpy.updateBasket).toHaveBeenCalledWith(product.id, 0);
  })

  it('should hide product-cart-info if it is light cart', () => {
    productCartComponent.isLight = true;
    productCartComponent.product = product;

    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      const componentElement: HTMLElement = fixture.nativeElement;
      const productCartInfo: HTMLElement | null = componentElement.querySelector('.product-cart-info');
      const productCartExtra: HTMLElement | null = componentElement.querySelector('.product-cart-extra');

      expect(productCartInfo).toBe(null);
      expect(productCartExtra).toBe(null);
    })
  })

  it('should call navigate for light card', () => {
    let routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    productCartComponent.isLight = true;
    productCartComponent.clickToCart(product.url);

    expect(routerSpy.navigate).toHaveBeenCalled();
  })

  it('should not call navigate for full card', () => {
    let routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    productCartComponent.isLight = false;
    productCartComponent.clickToCart(product.url);

    expect(routerSpy.navigate).not.toHaveBeenCalled();
  })
});
