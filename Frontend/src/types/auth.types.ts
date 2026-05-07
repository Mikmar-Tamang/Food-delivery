
export type PartnerRegisterForm = {
  displayName: string;
  email: string;
  password: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantPp: File;
};

export type RegisterForm = {
  username: string;
  email: string;
  password: string;
};


export type LoginForm = {
  email: string;
  password: string;
};