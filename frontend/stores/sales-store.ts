import { create } from "zustand";

export interface SaleItem {
  id: string;
  medicineId: string;
  medicineName: string;
  price: number;          // original price in BDT
  discountPrice?: number; // per-item discount price (optional) in BDT
  itemDiscountType?: "percentage" | "fixed"; // for UI display
  itemDiscountValue?: number; // for UI display
  quantity: number;
  subtotal: number;       // effective unit price * quantity in BDT
  stock: number;          // max available quantity for this item
}

export interface Sale {
  items: SaleItem[];
  subtotal: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
  itemsDiscount: number;
  totalDiscount: number;
  total: number;
  paymentStatus: "paid" | "due";
  paidAmount: number;
  customerName: string;
  customerPhone: string;
  issuedBy: string;
}

interface SalesState {
  currentSale: Sale;

  addItem: (medicine: {
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    stock: number;
  }) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  setItemDiscount: (itemId: string, type: "percentage" | "fixed", value: number) => void; // NEW
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
    itemsDiscount: 0,
    totalDiscount: 0,
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
      const nextQty = Math.min(existingItem.quantity + 1, existingItem.stock);
      get().updateQuantity(existingItem.id, nextQty);
    } else {
      if (medicine.stock <= 0) {
        return;
      }

      const unitPrice =
        medicine.discountPrice && medicine.discountPrice > 0
          ? medicine.discountPrice
          : medicine.price;

      const newItem: SaleItem = {
        id: Date.now().toString(),
        medicineId: medicine.id,
        medicineName: medicine.name,
        price: medicine.price,
        discountPrice: medicine.discountPrice,
        itemDiscountType: undefined,
        itemDiscountValue: 0,
        quantity: 1,
        subtotal: unitPrice,
        stock: medicine.stock,
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

  // NEW METHOD: Set discount for individual item
  setItemDiscount: (itemId, type, value) => {
    set((state) => ({
      currentSale: {
        ...state.currentSale,
        items: state.currentSale.items.map((item) => {
          if (item.id !== itemId) return item;

          let discountPrice = item.price;
          if (value > 0) {
            if (type === "percentage") {
              discountPrice = item.price - (item.price * value) / 100;
            } else {
              discountPrice = item.price - value;
            }
            discountPrice = Math.max(0, discountPrice);
          }

          const effectiveUnitPrice = value > 0 ? discountPrice : item.price;

          return {
            ...item,
            itemDiscountType: type,
            itemDiscountValue: value,
            discountPrice: value > 0 ? discountPrice : undefined,
            subtotal: effectiveUnitPrice * item.quantity,
          };
        }),
      },
    }));
    get().calculateTotals();
  },

  updateQuantity: (itemId, quantity) => {
    const { currentSale } = get();
    const item = currentSale.items.find((i) => i.id === itemId);
    if (!item) return;

    const clamped = Math.max(0, Math.min(quantity, item.stock));

    if (clamped <= 0) {
      get().removeItem(itemId);
      return;
    }

    set((state) => ({
      currentSale: {
        ...state.currentSale,
        items: state.currentSale.items.map((it) => {
          if (it.id !== itemId) return it;

          const effectiveUnitPrice =
            it.discountPrice && it.discountPrice > 0
              ? it.discountPrice
              : it.price;

          return {
            ...it,
            quantity: clamped,
            subtotal: effectiveUnitPrice * clamped,
          };
        }),
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

    const itemsDiscount = state.currentSale.items.reduce((sum, item) => {
      const effectiveUnitPrice =
        item.discountPrice && item.discountPrice > 0
          ? item.discountPrice
          : item.price;
      const perUnitDiscount = item.price - effectiveUnitPrice;
      return sum + perUnitDiscount * item.quantity;
    }, 0);

    let discountAmount = 0;
    if (state.currentSale.discountType === "percentage") {
      discountAmount = (subtotal * state.currentSale.discountValue) / 100;
    } else {
      discountAmount = state.currentSale.discountValue;
    }

    const total = Math.max(0, subtotal - discountAmount);
    const totalDiscount = itemsDiscount + discountAmount;

    set((state) => ({
      currentSale: {
        ...state.currentSale,
        subtotal,
        discountAmount,
        itemsDiscount,
        totalDiscount,
        total,
        paidAmount:
          state.currentSale.paymentStatus === "paid"
            ? total
            : state.currentSale.paidAmount,
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
        itemsDiscount: 0,
        totalDiscount: 0,
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
