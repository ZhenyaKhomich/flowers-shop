import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {OrderService} from '../../../../services/order.service';
import {OrderType} from '../../../../../types/order.type';
import {DefaultResponseType} from '../../../../../types/default-response.type';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {OrderStatusUtil} from '../../../../utils/order-status.util';

@Component({
  selector: 'orders',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    NgStyle
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})

export class OrdersComponent implements OnInit {
  private OrderService = inject(OrderService);
  orders: OrderType[] = [];

  ngOnInit() {
    this.OrderService.getOrders().subscribe((data: OrderType[] | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        const error = (data as DefaultResponseType).message;
        throw new Error(error);
      }

      this.orders = (data as OrderType[]).map(item => {
        const status = OrderStatusUtil.getStatusandColor(item.status);
        item.statusRus = status.name;
        item.color = status.color;
        return item;
      });
    })
  }
}
