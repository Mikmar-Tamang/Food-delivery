export type FoodType = {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: {
    url: string;
    public_id: string;
  };
  foodPartner?: {
    _id: string;
  restaurantAddress: string;
  };
};
