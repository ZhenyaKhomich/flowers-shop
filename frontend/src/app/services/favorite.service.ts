import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ProductType} from '../../types/product.type';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DefaultResponseType} from '../../types/default-response.type';
import {FavoriteType} from '../../types/favorite.type';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private http = inject(HttpClient);
  private AuthService = inject(AuthService);

  getFavorites(): Observable<FavoriteType[] | DefaultResponseType> {
    return this.http.get<FavoriteType[] | DefaultResponseType>(environment.api + 'favorites');
  }

  removeFavorite(id: string): Observable<DefaultResponseType> {
    return this.http.delete<DefaultResponseType>(environment.api + 'favorites', {body: {productId: id}});
  }

  addFavorite(id: string): Observable<FavoriteType[] | DefaultResponseType> {
    return this.http.post<FavoriteType[] | DefaultResponseType>(environment.api + 'favorites', {productId: id});
  }
}
