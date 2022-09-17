export interface Root {
  id: string;
  postedAt: string;
  description: string;
  title: string;
  User: User;
  offers: Offer[];
  heroImage: string;
  images: string[];
  category: Category[];
  acceptingOrders: boolean;
}

export interface User {
  username: string;
  acceptingOrders: boolean;
  bio: string;
  name: string;
  profileURL: string;
  rating: number;
  verified: boolean;
  ratedBy: string;
  createdAt: string;
  id: string;
}

export interface Offer {
  deliveryTime: number;
  description: string;
  name: string;
  price: string;
  id: string;
}

export interface Category {
  name: string;
  id: string;
}
