export type User = {
  _id: string;
  username: string;
  email: string;
  isBanned: boolean;
  role: "USER" | "ADMIN";
};

export type Partner = {
  _id: string;
  restaurantName: string;
  name: string;
  email: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isBanned: boolean;
};