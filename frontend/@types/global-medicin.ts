
export enum  DogeType {
    Tablet = 'Tablet',
   Syrup = 'Syrup',
   Capsule = 'Capsule',
   Injection = 'Injection',
}
export interface Medicine {
  _id: string;
  name: string;
  dosageType: string; // e.g., "Tablet", "Capsule"
  generic: string; // e.g., "Paracetamol", "Omeprazole"
  strength: string; // e.g., "500mg", "20mg + 5mg"
  manufacturer: string; // e.g., "Square Pharmaceuticals"
  UnitPrice: string; // can also be number if you prefer
  PackageSize: string; // e.g., "1 Box (10 tablets)"
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
