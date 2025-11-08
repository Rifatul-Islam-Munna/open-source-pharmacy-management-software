import { create } from "zustand";

export interface MedicineQuantity {
  boxes: number;
  cartonPerBox: number;
  stripsPerCarton: number;
  unitsPerStrip: number;
}

export interface Medicine {
  id: string;
  name: string;
  batchName: string;
  expiryDate: Date | undefined;
  purchasePrice: number;
  sellingPrice: number;
  quantity: MedicineQuantity;
  totalUnits: number;
  imageUrl?: string;
}

interface MedicineState {
  medicines: Medicine[];
  currentMedicine: Partial<Medicine> | null;
  
  // Actions
  setCurrentMedicine: (medicine: Partial<Medicine>) => void;
  updateCurrentMedicine: (updates: Partial<Medicine>) => void;
  updateQuantity: (quantity: Partial<MedicineQuantity>) => void;
  calculateTotalUnits: () => number;
  addMedicine: (medicine: Medicine) => void;
  removeMedicine: (id: string) => void;
  clearCurrentMedicine: () => void;
}

export const useMedicineStore = create<MedicineState>((set, get) => ({
  medicines: [],
  currentMedicine: {
    name: "",
    batchName: "",
    expiryDate: undefined,
    purchasePrice: 0,
    sellingPrice: 0,
    quantity: {
      boxes: 0,
      cartonPerBox: 0,
      stripsPerCarton: 0,
      unitsPerStrip: 0,
    },
    totalUnits: 0,
  },

  setCurrentMedicine: (medicine) => set({ currentMedicine: medicine }),

  updateCurrentMedicine: (updates) =>
    set((state) => ({
      currentMedicine: { ...state.currentMedicine, ...updates },
    })),

  updateQuantity: (quantity) =>
    set((state) => {
      const currentQuantity = state.currentMedicine?.quantity || {
        boxes: 0,
        cartonPerBox: 0,
        stripsPerCarton: 0,
        unitsPerStrip: 0,
      };
      
      const newQuantity = { ...currentQuantity, ...quantity };
      
      // Smart calculation: only multiply non-zero values
      const values = [
        newQuantity.boxes,
        newQuantity.cartonPerBox,
        newQuantity.stripsPerCarton,
        newQuantity.unitsPerStrip,
      ];
      
      // Filter out zeros and multiply remaining values
      const nonZeroValues = values.filter(val => val > 0);
      
      // If all values are 0, total is 0
      // Otherwise multiply all non-zero values
      const totalUnits = nonZeroValues.length === 0 
        ? 0 
        : nonZeroValues.reduce((acc, val) => acc * val, 1);

      return {
        currentMedicine: {
          ...state.currentMedicine,
          quantity: newQuantity,
          totalUnits,
        },
      };
    }),

  calculateTotalUnits: () => {
    const qty = get().currentMedicine?.quantity;
    if (!qty) return 0;
    
    const values = [
      qty.boxes,
      qty.cartonPerBox,
      qty.stripsPerCarton,
      qty.unitsPerStrip,
    ];
    
    const nonZeroValues = values.filter(val => val > 0);
    
    return nonZeroValues.length === 0 
      ? 0 
      : nonZeroValues.reduce((acc, val) => acc * val, 1);
  },

  addMedicine: (medicine) =>
    set((state) => ({
      medicines: [...state.medicines, medicine],
    })),

  removeMedicine: (id) =>
    set((state) => ({
      medicines: state.medicines.filter((m) => m.id !== id),
    })),

  clearCurrentMedicine: () =>
    set({
      currentMedicine: {
        name: "",
        batchName: "",
        expiryDate: undefined,
        purchasePrice: 0,
        sellingPrice: 0,
        quantity: {
          boxes: 0,
          cartonPerBox: 0,
          stripsPerCarton: 0,
          unitsPerStrip: 0,
        },
        totalUnits: 0,
      },
    }),
}));
