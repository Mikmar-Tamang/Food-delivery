
export interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

export type LoginForm = {
  email: string;
  password: string;
};

export interface PartnerRegisterForm {
  name: string;
  email: string;
  password: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantPp: File;
};