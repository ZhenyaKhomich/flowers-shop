import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ProductCartComponent} from '../../common/product-cart/product-cart.component';
import {ProductService} from '../../../services/product.service';
import {ProductType} from '../../../../types/product.type';
import {NgForOf, registerLocaleData} from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {CarouselModule, OwlOptions} from 'ngx-owl-carousel-o';
import {environment} from '../../../../environments/environment';
registerLocaleData(localeRu);

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterLink,
    ProductCartComponent,
    NgForOf,
    CarouselModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  private ProductService = inject(ProductService);

  products: ProductType[] = [];
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

  customOptionsReviews: OwlOptions = {
    loop: true,
    margin: 26,
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
    },
    nav: false
  }

  reviews = [
    {
      name: 'Ирина',
      image: 'review1.png',
      text: 'В ассортименте я встретила все комнатные растения, которые меня интересовали. Цены - лучшие в городе. Доставка - очень быстрая и с заботой о растениях. '
    },
    {
      name: 'Анастасия',
      image: 'review2.png',
      text: 'Спасибо огромное! Цветок арека невероятно красив - просто бомба! От него все в восторге! Спасибо за сервис - все удобно сделано, доставили быстро. И милая открыточка приятным бонусом.'
    },
    {
      name: 'Илья',
      image: 'review3.png',
      text: 'Магазин супер! Второй раз заказываю курьером, доставлено в лучшем виде. Ваш ассортимент комнатных растений впечатляет! Спасибо вам за хорошую работу!'
    },
    {
      name: 'Аделина',
      image: 'review4.jpg',
      text: 'Хочу поблагодарить всю команду за помощь в подборе подарка для моей мамы! Все просто в восторге от мини-сада! А самое главное, что за ним удобно ухаживать, ведь в комплекте мне дали целую инструкцию.'
    },
    {
      name: 'Яника',
      image: 'review5.jpg',
      text: 'Спасибо большое за мою обновлённую коллекцию суккулентов! Сервис просто на 5+: быстро, удобно, недорого. Что ещё нужно клиенту для счастья?'
    },
    {
      name: 'Марина',
      image: 'review6.jpg',
      text: 'Для меня всегда важным аспектом было наличие не только физического магазина, но и онлайн-маркета, ведь не всегда есть возможность прийти на место. Ещё нигде не встречала такого огромного ассортимента!'
    },
    {
      name: 'Станислав',
      image: 'review7.jpg',
      text: 'Хочу поблагодарить консультанта Ирину за помощь в выборе цветка для моей жены. Я ещё никогда не видел такого трепетного отношения к весьма непростому клиенту, которому сложно угодить! Сервис – огонь!'
    }
  ]

  ngOnInit() {
    this.ProductService.getBestProducts().subscribe((products:ProductType[]) => {
      console.log(products);
      this.products = products;
    })
  }

  protected readonly environment = environment;
}
