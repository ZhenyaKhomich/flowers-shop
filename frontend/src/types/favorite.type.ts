export type FavoriteType = {
  id: string,
  name: string,
  image: string,
  url: string,
  price: number,
  inBasket?: boolean;
  quantity?: number,
}
