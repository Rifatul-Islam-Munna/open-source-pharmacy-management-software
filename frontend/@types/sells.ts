export interface SalesResponse {
  sales: Sale[];
  pagination: Pagination;
}

export interface Sale {
  _id: string;
  items: SaleItem[];
  subtotal: number;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  discountAmount: number;
  itemsDiscount: number;
  totalDiscount: number;
  total: number;
  paymentStatus: 'paid' | 'due';
  paidAmount: number;
  customerName: string;
  customerPhone: string;
  issuedBy: string;
  transactionId: string;
  paymentType: string; // 'cash' | 'online' | etc.
  invoiceId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SaleItem {
  medicineId: string;
  medicineName: string;
  price: number;
  discountPrice: number;
  itemDiscountType: 'fixed' | 'percentage';
  itemDiscountValue: number;
  quantity: number;
  subtotal: number;
  stock: number;
  originalStock: number;
  doesType: string;
  batchId?: string;        // optional (not always present)
  expiryDate?: string;     // optional (not always present)
}

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
