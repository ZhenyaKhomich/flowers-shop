import {BasketService} from './basket.service';
import {HttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {environment} from '../../environments/environment';


describe('basket service', () => {
  let basketService: BasketService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let spy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    spy = jasmine.createSpyObj('HttpClient', ['get', 'post']);

    TestBed.configureTestingModule({
      providers: [
        BasketService,
        { provide: HttpClient, useValue: spy }
      ]
    });

    basketService = TestBed.inject(BasketService);
    httpSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    httpSpy.get.and.returnValue(of({ count: 3 }));
  });

  it('should emit new count value', (done) => {
    basketService.count$.subscribe(value => {
      expect(value).toBe(3);
      done();
    });

    basketService.getBasketCount().subscribe();
  })

  it('should make http request for basket data', (done) => {
    basketService.getBasket().subscribe(value => {
      expect(spy.get).toHaveBeenCalledWith(environment.api + 'cart', {withCredentials: true});
      done();
    });
  })
})
