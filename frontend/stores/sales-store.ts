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
  doesType?:string
  batchId?:string
  expiryDate?:string
  originalPrice?:number
  strength?:string
}

export interface Sale {
  items: SaleItem[];
  subtotal: number; // this subtotal is after the discount product
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
  issuedBy?: string;
  transactionId?: string;
  paymentType: string
  invoiceId?:string
}

interface SalesState {
  currentSale: Sale;

  addItem: (medicine: {
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    stock: number;
    doesType?:string
    batchId?:string
    expiryDate?:string
    originalPrice?:number
    strength?:string
  }) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  setItemDiscount: (itemId: string, type: "percentage" | "fixed", value: number) => void; // NEW
  setDiscount: (type: "percentage" | "fixed", value: number) => void;
  setPaymentStatus: (status: "paid" | "due") => void;
  setPaidAmount: (amount: number) => void;
  setTransactionId: (value: string) => void;
  setCustomerInfo: (name: string, phone: string) => void;
  setIssuedBy: (name: string) => void;
  setPaymentType: (name: string) => void;
  calculateTotals: () => void;
  clearSale: () => void;
}

export const useSalesStore = create<SalesState>((set, get) => ({
  currentSale: {
    items: [],
    subtotal: 0, // this subtotal is after the discount product
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
      transactionId: '',
  paymentType: ''
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
        doesType:medicine.doesType,
        expiryDate:medicine?.expiryDate,
        batchId:medicine?.batchId,
        originalPrice:medicine.originalPrice,
        strength:medicine.strength
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

          const totalLinePrice = item.price * item.quantity;
          let newSubtotal = totalLinePrice;

          if (value > 0) {
            if (type === "percentage") {
              // Percentage applies to the total amount
              newSubtotal = totalLinePrice - (totalLinePrice * value) / 100;
            } else {
              // Fixed: Simply subtract the input value from the Total Line Price
              // Example: 210 - 4 = 206
              newSubtotal = totalLinePrice - value;
            }
            newSubtotal = Math.max(0, newSubtotal);
          }

          // We calculate the "effective unit price" just for internal tracking,
          // but the math relies on the subtotal.
          const effectiveUnitPrice = item.quantity > 0 ? newSubtotal / item.quantity : 0;

          return {
            ...item,
            itemDiscountType: type,
            itemDiscountValue: value,
            discountPrice: value > 0 ? effectiveUnitPrice : undefined,
            subtotal: newSubtotal,
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

          const totalLinePrice = it.price * clamped;
          let newSubtotal = totalLinePrice;

          // Re-apply existing discount rules
          if (it.itemDiscountValue && it.itemDiscountValue > 0) {
             if (it.itemDiscountType === "percentage") {
                newSubtotal = totalLinePrice - (totalLinePrice * it.itemDiscountValue) / 100;
             } else {
                // Fixed: Subtract the same fixed amount (e.g. 4) from the new total
                // If you want the discount to scale with quantity, you'd change logic here,
                // but "Total Line Discount" usually implies a fixed override amount.
                newSubtotal = totalLinePrice - it.itemDiscountValue;
             }
             newSubtotal = Math.max(0, newSubtotal);
          } else if (it.discountPrice && !it.itemDiscountType) {
             // Default inventory discount (per unit)
             newSubtotal = it.discountPrice * clamped;
          }

          const effectiveUnitPrice = clamped > 0 ? newSubtotal / clamped : 0;

          return {
            ...it,
            quantity: clamped,
            subtotal: newSubtotal,
            discountPrice: (it.itemDiscountValue || it.discountPrice) ? effectiveUnitPrice : undefined
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

  setTransactionId: (value) => {
    set((state) => ({
      currentSale: {
        ...state.currentSale,
        transactionId: value,
      },
    }));
  },
  setPaymentType: (value) => {
    set((state) => ({
      currentSale: {
        ...state.currentSale,
        paymentType: value,
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

 // 3. FIX: Total Discount = (Sum of Originals) - (Sum of Subtotals)
  calculateTotals: () => {
    const state = get();
    const items = state.currentSale.items;

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const totalOriginalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // The gap between Original Total and New Subtotal is the exact discount amount
    const itemsDiscount = totalOriginalPrice - subtotal;

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
        itemsDiscount: 0,
        totalDiscount: 0,
        total: 0,
        paymentStatus: "paid",
        paidAmount: 0,
        customerName: "",
        customerPhone: "",
        issuedBy: "",
        transactionId: "",
        paymentType: ''
      },
    });
  },
}));
