import {inject, Injectable} from '@angular/core';
import {Observable, Subject, tap} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BasketType} from '../../types/basket.type';
import {DefaultResponseType} from '../../types/default-response.type';


@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private http = inject(HttpClient);
  private count: number = 0;
  count$: Subject<number> = new Subject<number>();

  setCount(count: number) {
    this.count = count;
    this.count$.next(count);
  }

  getBasket(): Observable<BasketType | DefaultResponseType> {
    return this.http.get<BasketType | DefaultResponseType>(environment.api + 'cart', {withCredentials: true});
  }

  updateBasket(productId: string, quantity: number): Observable<BasketType | DefaultResponseType> {
    return this.http.post<BasketType | DefaultResponseType>(environment.api + 'cart', {productId, quantity}, {withCredentials: true})
      .pipe(
        tap(data => {
          if(!data.hasOwnProperty("error")) {
            let count = 0;
            (data as BasketType).items.forEach((element) => {
             count += element.quantity;
            })
            this.setCount(count);
          }
        })
      );
  }

  getBasketCount(): Observable<{count: number} | DefaultResponseType> {
    return this.http.get<{count: number} | DefaultResponseType>(environment.api + 'cart/count', {withCredentials: true})
      .pipe(
        tap(data => {
          if(!data.hasOwnProperty("error")) {
            this.setCount((data as {count: number}).count)
          }
        })
      );
  }
}
