export interface Food {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

export interface BasketItem {
  _id: string;
  foodId: Food;
  quantity: number;
}

export interface Basket {
  _id: string;
  userId: string;
  items: BasketItem[];
}