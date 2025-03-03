// these are the types that are used in the frontend
// we can use these types to define the shape of our data

export enum CategoryEnum {
  REDUCING_PLASTIC_USE = "Reducing Plastic Use",
  REDUCING_ENERGY_CONSUMPTION = "Reducing Energy Consumption",
  SAVE_WATER = "Save Water",
  MINIMALIZING_FOOD_WASTE = "Minimalizing Food Waste",
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  category: CategoryEnum;
  isAdmin: boolean;
}

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Activities = {
  id: string;
  type: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Order = {
  id: string;
  userId: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Review = {
  id: string;
  userId: string;
  orderId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
};
