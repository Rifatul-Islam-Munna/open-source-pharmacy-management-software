import { create } from "zustand";

export interface SaleItem {
  id: string;
  medicineId: string;
  medicineName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Sale {
  items: SaleItem[];
  subtotal: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
  total: number;
  paymentStatus: "paid" | "due";
  paidAmount: number;
  customerName: string;
  customerPhone: string;
  issuedBy: string;
}

interface SalesState {
  currentSale: Sale;
  
  // Actions
  addItem: (medicine: { id: string; name: string; price: number }) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  setDiscount: (type: "percentage" | "fixed", value: number) => void;
  setPaymentStatus: (status: "paid" | "due") => void;
  setPaidAmount: (amount: number) => void;
  setCustomerInfo: (name: string, phone: string) => void;
  setIssuedBy: (name: string) => void;
  calculateTotals: () => void;
  clearSale: () => void;
}

export const useSalesStore = create<SalesState>((set, get) => ({
  currentSale: {
    items: [],
    subtotal: 0,
    discountType: "percentage",
    discountValue: 0,
    discountAmount: 0,
    total: 0,
    paymentStatus: "paid",
    paidAmount: 0,
    customerName: "",
    customerPhone: "",
    issuedBy: "",
  },

  addItem: (medicine) => {
    const state = get();
    const existingItem = state.currentSale.items.find(
      (item) => item.medicineId === medicine.id
    );

    if (existingItem) {
      get().updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const newItem: SaleItem = {
        id: Date.now().toString(),
        medicineId: medicine.id,
        medicineName: medicine.name,
        price: medicine.price,
        quantity: 1,
        subtotal: medicine.price,
      };

      set((state) => ({
        currentSale: {
          ...state.currentSale,
          items: [...state.currentSale.items, newItem],
        },
      }));
      get().calculateTotals();
    }
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    set((state) => ({
      currentSale: {
        ...state.currentSale,
        items: state.currentSale.items.map((item) =>
          item.id === itemId
            ? { ...item, quantity, subtotal: item.price * quantity }
            : item
        ),
      },
    }));
    get().calculateTotals();
  },

  removeItem: (itemId) => {
    set((state) => ({
      currentSale: {
        ...state.currentSale,
        items: state.currentSale.items.filter((item) => item.id !== itemId),
      },
    }));
    get().calculateTotals();
  },

  setDiscount: (type, value) => {
    set((state) => ({
      currentSale: {
        ...state.currentSale,
        discountType: type,
        discountValue: value,
      },
    }));
    get().calculateTotals();
  },

  setPaymentStatus: (status) => {
    set((state) => ({
      currentSale: {
        ...state.currentSale,
        paymentStatus: status,
        paidAmount: status === "paid" ? state.currentSale.total : 0,
      },
    }));
  },

  setPaidAmount: (amount) => {
    set((state) => ({
      currentSale: {
        ...state.currentSale,
        paidAmount: amount,
      },
    }));
  },

  setCustomerInfo: (name, phone) => {
    set((state) => ({
      currentSale: {
        ...state.currentSale,
        customerName: name,
        customerPhone: phone,
      },
    }));
  },

  setIssuedBy: (name) => {
    set((state) => ({
      currentSale: {
        ...state.currentSale,
        issuedBy: name,
      },
    }));
  },

  calculateTotals: () => {
    const state = get();
    const subtotal = state.currentSale.items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    let discountAmount = 0;
    if (state.currentSale.discountType === "percentage") {
      discountAmount = (subtotal * state.currentSale.discountValue) / 100;
    } else {
      discountAmount = state.currentSale.discountValue;
    }

    const total = Math.max(0, subtotal - discountAmount);

    set((state) => ({
      currentSale: {
        ...state.currentSale,
        subtotal,
        discountAmount,
        total,
        paidAmount: state.currentSale.paymentStatus === "paid" ? total : state.currentSale.paidAmount,
      },
    }));
  },

  clearSale: () => {
    set({
      currentSale: {
        items: [],
        subtotal: 0,
        discountType: "percentage",
        discountValue: 0,
        discountAmount: 0,
        total: 0,
        paymentStatus: "paid",
        paidAmount: 0,
        customerName: "",
        customerPhone: "",
        issuedBy: "",
      },
    });
  },
}));
