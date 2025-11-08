"use client";

import { useState, useEffect, ViewTransition } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  User,
  Phone,
  Percent,
  DollarSign,
  Save,
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
import { useSalesStore } from "@/stores/sales-store";

// Demo medicine data
const availableMedicines = [
  { id: "1", name: "Paracetamol 500mg", price: 7.2, stock: 100 },
  { id: "2", name: "Amoxicillin 250mg", price: 6.5, stock: 50 },
  { id: "3", name: "Ibuprofen 200mg", price: 12.0, stock: 75 },
  { id: "4", name: "Cetirizine 10mg", price: 5.5, stock: 120 },
  { id: "5", name: "Omeprazole 20mg", price: 9.75, stock: 60 },
  { id: "6", name: "Metformin 500mg", price: 4.25, stock: 90 },
  { id: "7", name: "Aspirin 81mg", price: 18.25, stock: 30 },
  { id: "8", name: "Loratadine 10mg", price: 8.0, stock: 45 },
];

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
  } = useSalesStore();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [discountInput, setDiscountInput] = useState("");

  // Set default issued by on mount
  useEffect(() => {
    setIssuedBy("Admin User"); // You can get this from auth context
  }, [setIssuedBy]);

  const handleAddMedicine = (medicine: (typeof availableMedicines)[0]) => {
    addItem(medicine);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleDiscountChange = (value: string) => {
    setDiscountInput(value);
    const numValue = parseFloat(value) || 0;
    setDiscount(currentSale.discountType, numValue);
  };

  const handleSaveSale = () => {
    if (currentSale.items.length === 0) {
      alert("Please add at least one medicine");
      return;
    }

    // Here you would save to backend
    console.log("Saving sale:", currentSale);
    alert("Sale saved successfully!");
    clearSale();
    setDiscountInput("");
  };

  const filteredMedicines = availableMedicines.filter((med) =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-3">
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
                  <Command>
                    <CommandInput
                      placeholder="Type medicine name..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>No medicine found.</CommandEmpty>
                      <CommandGroup>
                        {filteredMedicines.map((medicine) => (
                          <CommandItem
                            key={medicine.id}
                            onSelect={() => handleAddMedicine(medicine)}
                            className="cursor-pointer hover:bg-light-gray"
                          >
                            <div className="flex items-center justify-between w-full">
                              <div>
                                <p className="text-sm font-medium text-dark-blue">
                                  {medicine.name}
                                </p>
                                <p className="text-xs text-dark-text/60">
                                  Stock: {medicine.stock}
                                </p>
                              </div>
                              <Badge className="bg-primary-blue/10 text-primary-blue border-primary-blue/20">
                                ${medicine.price.toFixed(2)}
                              </Badge>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
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
                      className="flex items-center gap-3 p-2 border border-border-gray rounded-lg hover:bg-light-gray transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dark-blue truncate">
                          {item.medicineName}
                        </p>
                        <p className="text-xs text-dark-text/60">
                          ${item.price.toFixed(2)} × {item.quantity} = $
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
                        <div className="w-10 text-center">
                          <span className="text-sm font-semibold text-dark-blue">
                            {item.quantity}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="h-7 w-7 border-border-gray hover:bg-light-gray shadow-none"
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
                      <DollarSign className="h-3 w-3" />
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

              {/* Payment Status Row */}
              <div>
                <Label className="text-xs text-dark-text mb-1.5 block">
                  Payment
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
                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dark-text/50" />
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
                    Remaining: $
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
                  ${currentSale.subtotal.toFixed(2)}
                </span>
              </div>
              {currentSale.discountAmount > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-dark-text">Discount:</span>
                  <span className="font-semibold text-yellow-600">
                    -${currentSale.discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="border-t border-border-gray pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-dark-blue">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-primary-blue">
                    ${currentSale.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {currentSale.paymentStatus === "due" &&
                currentSale.paidAmount > 0 && (
                  <>
                    <div className="flex justify-between text-xs border-t border-border-gray pt-2">
                      <span className="text-dark-text">Paid Now:</span>
                      <span className="font-semibold text-success">
                        ${currentSale.paidAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-dark-text">Due Amount:</span>
                      <span className="font-bold text-yellow-600">
                        $
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
                disabled={currentSale.items.length === 0}
                className="w-full h-9 bg-success hover:bg-success/90 text-white shadow-none text-sm"
              >
                <Save className="h-3.5 w-3.5 mr-2" />
                Complete Sale
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
