export interface User {
  _id: string;
  type: string;
  ownerName?: string;
  shopName: string;
  mobileNumber: string;
  location: string;
  email: string;
  password: string;
  slug: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  workerName?: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: User;
}
