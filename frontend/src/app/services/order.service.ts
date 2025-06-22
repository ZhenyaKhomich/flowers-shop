import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {DefaultResponseType} from '../../types/default-response.type';
import {OrderType} from '../../types/order.type';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);

  createOrder(params: OrderType): Observable<OrderType | DefaultResponseType> {
    return this.http.post<OrderType | DefaultResponseType>(environment.api + 'orders', params, {withCredentials: true})
  }

  getOrders(): Observable<OrderType[] | DefaultResponseType> {
    return this.http.get<OrderType[] | DefaultResponseType>(environment.api + 'orders')
  }
}
