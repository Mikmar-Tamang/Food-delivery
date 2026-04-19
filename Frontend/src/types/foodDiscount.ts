type ImageType = {
  url: string;
  public_id: string;
};

type FoodPartnerType = {
  _id: string;
  restaurantAddress: string;
  restaurantPp: {
    url: string;
    public_id: string;
  };
  restaurantName: string;
};

type FoodType = {
  _id: string;
  name: string;
  price: number;
  image: ImageType;
  foodPartner?: FoodPartnerType;
};

export type FoodDiscountType = {
  _id: string;
  discount: string;
  discountTime: string;
  food?: FoodType;
};