export interface Order {
  _id: string;
  medicine: string;
  quantity?: number;
  box?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrdersResponse {
  data: Order[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  totalPages: number;
}
