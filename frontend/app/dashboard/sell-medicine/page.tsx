"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  User,
  Phone,
  Percent,
  Save,
  Banknote,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Sale, useSalesStore } from "@/stores/sales-store";
import { useDebounce } from "use-debounce";
import { useQueryWrapper } from "@/api-hooks/react-query-wrapper";
import { Medicine, MedicineResponse } from "@/@types/inventory";
import ReceiptDialog from "@/components/custom/Receipt/ReceiptDialog";
import { nanoid } from "nanoid";
import { useCommonMutationApi } from "@/api-hooks/mutation-common";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/hooks/useUser";
export default function SellMedicinePage() {
  const {
    currentSale,
    addItem,
    updateQuantity,
    removeItem,
    setDiscount,
    setPaymentStatus,
    setPaidAmount,
    setCustomerInfo,
    setIssuedBy,
    clearSale,
    setPaymentType,
    setTransactionId,
  } = useSalesStore();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [discountInput, setDiscountInput] = useState("");
  const [open, setOpen] = useState(false);
  const [sales, SetSales] = useState<Sale | null>(null);

  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const query = new URLSearchParams();
  if (debouncedSearch?.length > 2) query.append("searchQuery", debouncedSearch);

  const { data, isPending } = useQueryWrapper<MedicineResponse>(
    ["sells-medicines", debouncedSearch],
    `/shop?${query.toString()}`
  );
  const { user } = useUser();
  const { mutate, isPending: isSaving } = useCommonMutationApi({
    url: "/sells/create-new-sales",
    method: "POST",
    successMessage: "Sale created successfully",
    mutationKey: ["create-new-salles"],
    onSuccess: (data) => {
      console.log("Success:", data);

      clearSale();
      setOpen(true);
    },
  });
  // Set default issued by on mount
  useEffect(() => {
    setIssuedBy(user?.name ?? "unknown"); // You can get this from auth context
  }, [setIssuedBy, user?.name]);

  const handleAddMedicine = (medicine: Medicine) => {
    const payload = {
      id: medicine._id,
      name: medicine.name,
      price: medicine.sellingPrice,
      stock: medicine.totalUnits,
      doesType: medicine?.shopMedicineId?.dosageType || "",
      batchId: medicine?.batchNumber || "",
      expiryDate: medicine.expiryDate,
      originalPrice: medicine?.purchasePrice || 0,
      strength: medicine?.shopMedicineId?.strength || "",
    };
    addItem(payload);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleDiscountChange = (value: string) => {
    setDiscountInput(value);
    const numValue = parseFloat(value) || 0;
    setDiscount(currentSale?.discountType, numValue);
  };

  const generateInvoice = () => {
    const d = new Date();
    const y = String(d.getFullYear()).slice(-2);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    const id = nanoid(10); // 10 chars is perfect

    return `${y}${m}${day}-${id}`;
  };
  const handleSaveSale = () => {
    if (currentSale.items.length === 0) {
      alert("Please add at least one medicine");
      return;
    }
    const payload = {
      ...currentSale,
      invoiceId: generateInvoice(),
    };
    SetSales(payload);

    mutate(payload);
    console.log("Saving sale:", generateInvoice());
  };

  console.log("data-of-data", data);

  return (
    <div className="space-y-3">
      <ReceiptDialog open={open} onOpenChange={setOpen} sale={sales} />
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-gray bg-white">
        <h1 className="text-2xl font-bold text-dark-blue">Sell Medicine</h1>
        <p className="text-sm text-dark-text mt-0.5">
          Create new sale and manage transactions
        </p>
      </div>

      <div className="px-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Side - Medicine Selection & Cart */}
        <div className="lg:col-span-2 space-y-3">
          {/* Search Medicine */}
          <Card className="border-border-gray shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-dark-blue">
                Add Medicines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-10 border-border-gray hover:border-primary-blue shadow-none"
                  >
                    <Search className="h-4 w-4 mr-2 text-dark-text/50" />
                    <span className="text-dark-text/60">
                      Search medicine by name...
                    </span>
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-full p-0 shadow-none border-border-gray"
                  align="start"
                >
                  <div className="p-2">
                    <Input
                      placeholder="Type medicine name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mb-2"
                    />

                    {isPending && (
                      <div className="p-2 text-xs text-muted-foreground">
                        Searching...
                      </div>
                    )}

                    {!isPending && data && data.data.length === 0 && (
                      <div className="p-2 text-xs text-muted-foreground">
                        No medicine found.
                      </div>
                    )}

                    {!isPending && data && data.data.length > 0 && (
                      <div className="max-h-64 overflow-y-auto">
                        {data.data.map((medicine) => (
                          <button
                            key={medicine._id}
                            type="button"
                            onClick={() => handleAddMedicine(medicine)}
                            className="w-full text-left px-2 py-1.5 text-sm hover:bg-light-gray flex items-center i justify-start gap-3"
                          >
                            <div>
                              <p className="font-medium text-dark-blue">
                                {medicine.name}
                              </p>
                              <p className="text-xs text-dark-text/60">
                                Stock: {medicine.totalUnits}
                              </p>
                            </div>
                            <div className=" flex flex-col mx-2">
                              <p className="text-xs text-dark-text/60">
                                strength:{" "}
                                <span className=" text-green-700 font-bold text-xs">
                                  {medicine?.shopMedicineId?.strength}
                                </span>
                              </p>
                              <p className="text-xs text-dark-text/60">
                                Batch:{" "}
                                <span className=" text-green-700 font-bold text-xs">
                                  {medicine?.batchNumber}
                                </span>
                              </p>
                              <p className="text-xs text-dark-text/60">
                                Does Type:{" "}
                                <span className=" text-green-700 font-bold text-sm">
                                  {medicine?.shopMedicineId?.dosageType}
                                </span>
                              </p>
                            </div>
                            <Badge className="bg-primary-blue/10 text-primary-blue border-primary-blue/20">
                              ৳{medicine.sellingPrice.toFixed(2)}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          {/* Cart Items */}
          <Card className="border-border-gray shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-dark-blue">
                  Cart Items ({currentSale.items.length})
                </CardTitle>
                {currentSale.items.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSale}
                    className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {currentSale.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-dark-text/60">
                  <ShoppingCart className="h-12 w-12 mb-3 text-dark-text/30" />
                  <p className="text-sm">No items in cart</p>
                  <p className="text-xs mt-1">Search and add medicines above</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentSale.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 border border-border-gray rounded-lg hover:bg-light-gray transition-colors space-y-2"
                    >
                      {/* Top Row: Name, Price, Quantity, Delete */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-dark-blue truncate">
                            {item.medicineName} -{item?.doesType}
                          </p>
                          <p className="text-xs text-dark-text/60">
                            ৳{item.price.toFixed(2)} × {item.quantity} = ৳
                            {item.subtotal.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="h-7 w-7 border-border-gray hover:bg-light-gray shadow-none"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <div className="text-center">
                            <Input
                              type="number"
                              className="w-20"
                              value={item.quantity}
                              onChange={(e) => {
                                if (parseInt(e.target.value) > 0) {
                                  updateQuantity(
                                    item.id,
                                    parseInt(e.target.value)
                                  );
                                }
                              }}
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="h-7 w-7 border-border-gray ml-3 hover:bg-light-gray shadow-none"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* Bottom Row: Item Discount */}
                      <div className="flex items-center gap-2 pt-1 border-t border-border-gray/50">
                        <Label className="text-[10px] text-dark-text/70 whitespace-nowrap">
                          Item Discount:
                        </Label>
                        <div className="flex gap-1 bg-white p-0.5 rounded border border-border-gray">
                          <Button
                            variant={
                              item.itemDiscountType === "percentage"
                                ? "default"
                                : "ghost"
                            }
                            size="sm"
                            onClick={() =>
                              useSalesStore
                                .getState()
                                .setItemDiscount(
                                  item.id,
                                  "percentage",
                                  item.itemDiscountValue || 0
                                )
                            }
                            className={`h-6 px-1.5 text-[9px] ${
                              item.itemDiscountType === "percentage"
                                ? "bg-primary-blue text-white hover:bg-primary-blue"
                                : "hover:bg-light-gray text-dark-text"
                            }`}
                          >
                            <Percent className="h-2.5 w-2.5" />
                          </Button>
                          <Button
                            variant={
                              item.itemDiscountType === "fixed"
                                ? "default"
                                : "ghost"
                            }
                            size="sm"
                            onClick={() =>
                              useSalesStore
                                .getState()
                                .setItemDiscount(
                                  item.id,
                                  "fixed",
                                  item.itemDiscountValue || 0
                                )
                            }
                            className={`h-6 px-1.5 text-[9px] ${
                              item.itemDiscountType === "fixed"
                                ? "bg-primary-blue text-white hover:bg-primary-blue"
                                : "hover:bg-light-gray text-dark-text"
                            }`}
                          >
                            <Banknote />
                          </Button>
                        </div>
                        <Input
                          type="number"
                          placeholder="0"
                          value={item.itemDiscountValue || ""}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            useSalesStore
                              .getState()
                              .setItemDiscount(
                                item.id,
                                item.itemDiscountType || "percentage",
                                val
                              );
                          }}
                          className="h-6 flex-1 border-border-gray focus:border-primary-blue shadow-none text-xs"
                        />
                        {item.itemDiscountValue &&
                          item.itemDiscountValue > 0 && (
                            <span className="text-[10px] text-success font-medium whitespace-nowrap">
                              -৳
                              {/* Logic: If Fixed, show value directly. If %, calculate amount. */}
                              {item.itemDiscountType === "fixed"
                                ? item.itemDiscountValue.toFixed(2)
                                : (
                                    (item.price *
                                      item.quantity *
                                      item.itemDiscountValue) /
                                    100
                                  ).toFixed(2)}
                            </span>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Summary & Customer Info */}
        <div className="space-y-3">
          {/* Customer Information */}
          <Card className="border-border-gray shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-dark-blue">
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label
                  htmlFor="customer-name"
                  className="text-sm text-dark-text"
                >
                  Customer Name
                </Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-text/50" />
                  <Input
                    id="customer-name"
                    placeholder="Enter customer name"
                    value={currentSale.customerName}
                    onChange={(e) =>
                      setCustomerInfo(e.target.value, currentSale.customerPhone)
                    }
                    className="pl-9 h-9 border-border-gray focus:border-primary-blue shadow-none text-sm"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="customer-phone"
                  className="text-sm text-dark-text"
                >
                  Phone Number
                </Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-text/50" />
                  <Input
                    id="customer-phone"
                    placeholder="Enter phone number"
                    value={currentSale.customerPhone}
                    onChange={(e) =>
                      setCustomerInfo(currentSale.customerName, e.target.value)
                    }
                    className="pl-9 h-9 border-border-gray focus:border-primary-blue shadow-none text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compact Discount & Payment - Combined */}

          <Card className="border-border-gray shadow-none">
            <CardContent className="p-3 space-y-2.5">
              {/* Discount Row */}
              <div>
                <Label className="text-xs text-dark-text mb-1.5 block">
                  Discount
                </Label>
                <div className="flex gap-1.5">
                  <div className="flex gap-1 bg-light-gray p-0.5 rounded border border-border-gray">
                    <Button
                      variant={
                        currentSale.discountType === "percentage"
                          ? "default"
                          : "ghost"
                      }
                      size="sm"
                      onClick={() =>
                        setDiscount("percentage", currentSale.discountValue)
                      }
                      className={`h-7 px-2 text-[10px] ${
                        currentSale.discountType === "percentage"
                          ? "bg-primary-blue text-white hover:bg-primary-blue"
                          : "hover:bg-white text-dark-text"
                      }`}
                    >
                      <Percent className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={
                        currentSale.discountType === "fixed"
                          ? "default"
                          : "ghost"
                      }
                      size="sm"
                      onClick={() =>
                        setDiscount("fixed", currentSale.discountValue)
                      }
                      className={`h-7 px-2 text-[10px] ${
                        currentSale.discountType === "fixed"
                          ? "bg-primary-blue text-white hover:bg-primary-blue"
                          : "hover:bg-white text-dark-text"
                      }`}
                    >
                      <Banknote className="h-3 w-3" />
                    </Button>
                  </div>
                  <Input
                    type="number"
                    placeholder="0"
                    value={discountInput}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    className="h-7 flex-1 border-border-gray focus:border-primary-blue shadow-none text-sm"
                  />
                </div>
              </div>

              {/* Payment Type Row */}
              <div>
                <Label className="text-xs text-dark-text mb-1.5 block">
                  Payment Type
                </Label>
                <div className="flex gap-1 bg-light-gray p-0.5 rounded border border-border-gray">
                  <Button
                    variant={
                      currentSale.paymentType === "cash" ? "default" : "ghost"
                    }
                    size="sm"
                    onClick={() => setPaymentType("cash")}
                    className={`h-7 flex-1 text-xs ${
                      currentSale.paymentType === "cash"
                        ? "bg-primary-blue text-white hover:bg-primary-blue"
                        : "hover:bg-white text-dark-text"
                    }`}
                  >
                    <Banknote className="h-3 w-3 mr-1" />
                    Cash
                  </Button>
                  <Button
                    variant={
                      currentSale.paymentType === "online" ? "default" : "ghost"
                    }
                    size="sm"
                    onClick={() => setPaymentType("online")}
                    className={`h-7 flex-1 text-xs ${
                      currentSale.paymentType === "online"
                        ? "bg-primary-blue text-white hover:bg-primary-blue"
                        : "hover:bg-white text-dark-text"
                    }`}
                  >
                    <CreditCard className="h-3 w-3 mr-1" />
                    Online
                  </Button>
                </div>
              </div>

              {/* Transaction ID - Only show when Online is selected */}
              {currentSale.paymentType === "online" && (
                <div>
                  <Label
                    htmlFor="transaction-id"
                    className="text-xs text-dark-text mb-1.5 block"
                  >
                    Transaction ID
                  </Label>
                  <Input
                    id="transaction-id"
                    type="text"
                    placeholder="Enter transaction ID"
                    value={currentSale.transactionId || ""}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="h-7 border-border-gray focus:border-primary-blue shadow-none text-sm"
                  />
                </div>
              )}

              {/* Payment Status Row */}
              <div>
                <Label className="text-xs text-dark-text mb-1.5 block">
                  Payment Status
                </Label>
                <div className="flex gap-1 bg-light-gray p-0.5 rounded border border-border-gray">
                  <Button
                    variant={
                      currentSale.paymentStatus === "paid" ? "default" : "ghost"
                    }
                    size="sm"
                    onClick={() => setPaymentStatus("paid")}
                    className={`h-7 flex-1 text-xs ${
                      currentSale.paymentStatus === "paid"
                        ? "bg-success text-white hover:bg-success"
                        : "hover:bg-white text-dark-text"
                    }`}
                  >
                    Paid
                  </Button>
                  <Button
                    variant={
                      currentSale.paymentStatus === "due" ? "default" : "ghost"
                    }
                    size="sm"
                    onClick={() => setPaymentStatus("due")}
                    className={`h-7 flex-1 text-xs ${
                      currentSale.paymentStatus === "due"
                        ? "bg-yellow-600 text-white hover:bg-yellow-600"
                        : "hover:bg-white text-dark-text"
                    }`}
                  >
                    Due
                  </Button>
                </div>
              </div>

              {/* Partial Payment - Only show when Due is selected */}
              {currentSale.paymentStatus === "due" && (
                <div>
                  <Label
                    htmlFor="paid-amount"
                    className="text-xs text-dark-text mb-1.5 block"
                  >
                    Amount Paid Now
                  </Label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-dark-text/50">
                      ৳
                    </span>
                    <Input
                      id="paid-amount"
                      type="number"
                      placeholder="0.00"
                      value={currentSale.paidAmount || ""}
                      onChange={(e) =>
                        setPaidAmount(parseFloat(e.target.value) || 0)
                      }
                      className="h-7 pl-7 border-border-gray focus:border-primary-blue shadow-none text-sm"
                    />
                  </div>
                  <p className="text-[10px] text-dark-text/60 mt-1">
                    Remaining: ৳
                    {Math.max(
                      0,
                      currentSale.total - (currentSale.paidAmount || 0)
                    ).toFixed(2)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="border-border-gray shadow-none bg-light-gray">
            <CardContent className="p-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-dark-text">Subtotal:</span>
                <span className="font-semibold text-dark-blue">
                  ৳{currentSale.subtotal.toFixed(2)}
                </span>
              </div>
              {currentSale.discountAmount > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-dark-text">Discount:</span>
                  <span className="font-semibold text-yellow-600">
                    -৳{currentSale.discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="border-t border-border-gray pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-dark-blue">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-primary-blue">
                    ৳{currentSale.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {currentSale.paymentStatus === "due" &&
                currentSale.paidAmount > 0 && (
                  <>
                    <div className="flex justify-between text-xs border-t border-border-gray pt-2">
                      <span className="text-dark-text">Paid Now:</span>
                      <span className="font-semibold text-success">
                        ৳{currentSale.paidAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-dark-text">Due Amount:</span>
                      <span className="font-bold text-yellow-600">
                        ৳
                        {(currentSale.total - currentSale.paidAmount).toFixed(
                          2
                        )}
                      </span>
                    </div>
                  </>
                )}

              <div className="pt-1.5 border-t border-border-gray">
                <p className="text-[10px] text-dark-text/60">
                  Issued by:{" "}
                  <span className="font-medium">{currentSale.issuedBy}</span>
                </p>
              </div>

              <Button
                onClick={handleSaveSale}
                disabled={
                  currentSale.items.length === 0 ||
                  !currentSale.paymentType.trim() ||
                  isSaving
                }
                className="w-full h-9 bg-success hover:bg-success/90 text-white shadow-none text-sm"
              >
                {isSaving ? (
                  <Spinner className="mr-2" />
                ) : (
                  <Save className="h-3.5 w-3.5 mr-2" />
                )}
                Complete Sale
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
