export type BasketType = {
  items: {
    product: {
      id: string,
      name: string,
      price: number,
      image: string,
      url: string,
    },
    quantity: number,
  }[]
}
