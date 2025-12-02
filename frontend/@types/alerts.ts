// types/alerts.ts
export type AlertType = "expiring" | "low-stock";

export interface AlertItem {
  id: string;
  name: string;
  batchName: string;
  type: AlertType;
  expiryDate: string | null;
  currentStock: number | null;
  threshold: number | null;
  daysUntilExpiry: number | null;
  shopMedicineId: string;
}

export interface AlertsResponse {
  data: AlertItem[];
  total: number;
  page: number;
  itemsPerPage: number;
  totalPages: number;
}
