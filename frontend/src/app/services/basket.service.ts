import {inject, Injectable} from '@angular/core';
import {Observable, Subject, tap} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BasketType} from '../../types/basket.type';


@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private http = inject(HttpClient);
  count: number = 0;
  count$: Subject<number> = new Subject<number>();

  getBasket(): Observable<BasketType> {
    return this.http.get<BasketType>(environment.api + 'cart', {withCredentials: true} );
  }

  updateBasket(productId: string, quantity: number): Observable<BasketType> {
    return this.http.post<BasketType>(environment.api + 'cart', {productId, quantity}, {withCredentials: true})
      .pipe(
        tap(data => {
          this.count = 0;
          data.items.forEach((element) => {
            this.count += element.quantity;
          })
          this.count$.next(this.count);
        })
      );
  }

  getBasketCount(): Observable<{count: number}> {
    return this.http.get<{count: number}>(environment.api + 'cart/count', {withCredentials: true})
      .pipe(
        tap(data => {
          this.count = data.count
          this.count$.next(data.count)
        })
      );
  }
}
