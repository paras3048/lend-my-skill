export type User = {
  id: string;
  username: string;
  email?: string;
  name: string;
  verified: boolean;
  profileURL: string;
  bannerURL?: string;
  bannerColor: string;
  acceptingOrders: boolean;
  postings?: number;
  rating?: number;
  reviews?: number;
  wallet?: number;
  notifications?: number;
  Warnings?: number;
};
