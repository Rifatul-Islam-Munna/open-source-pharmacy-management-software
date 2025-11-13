export interface MedicineQuantity {
  boxes: number;
  cartonPerBox: number;
  stripsPerCarton: number;
  unitsPerStrip: number;
}

export interface ShopMedicine {
  _id: string;
  name: string;
  dosageType: string;
  generic: string;
  strength: string;
  manufacturer: string;
  slug: string;
}

export interface Medicine {
  _id: string;
  shopMedicineId: ShopMedicine;
  expiryDate: string; // ISO date string
  sellingPrice: number;
  purchasePrice: number;
  batchNumber: string;
  name: string;
  totalUnits: number;
  quantity: MedicineQuantity;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface MedicineResponseMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MedicineResponse {
  data: Medicine[];
  meta: MedicineResponseMeta;
}

