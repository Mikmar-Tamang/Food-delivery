export type User = {
  _id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
};