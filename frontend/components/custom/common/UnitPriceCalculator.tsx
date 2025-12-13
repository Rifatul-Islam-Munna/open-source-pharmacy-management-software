"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins, DollarSign, Receipt } from "lucide-react";
import { useMedicineStore } from "@/stores/medicine-store";

export function UnitPriceCalculator() {
  const [open, setOpen] = useState(false);
  const [totalSellingPrice, setTotalSellingPrice] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [profitPercent, setProfitPercent] = useState("");

  const [profitAmount, setProfitAmount] = useState(0);
  const [totalPurchasePrice, setTotalPurchasePrice] = useState(0);
  const [purchasePricePerUnit, setPurchasePricePerUnit] = useState(0);
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState(0);

  useEffect(() => {
    const sellingTotal = parseFloat(totalSellingPrice) || 0;
    const units = parseFloat(totalUnits) || 0;
    const percent = parseFloat(profitPercent) || 0;

    if (sellingTotal > 0 && units > 0) {
      // Profit amount from total selling price
      const profit = sellingTotal * (percent / 100);
      setProfitAmount(profit);

      // Total purchase price (selling - profit)
      const purchaseTotal = sellingTotal - profit;
      setTotalPurchasePrice(purchaseTotal);

      // Purchase price per unit
      const purchasePerUnit = purchaseTotal / units;
      setPurchasePricePerUnit(purchasePerUnit);

      // Selling price per unit
      const sellPerUnit = sellingTotal / units;
      setSellingPricePerUnit(sellPerUnit);
    } else {
      setProfitAmount(0);
      setTotalPurchasePrice(0);
      setPurchasePricePerUnit(0);
      setSellingPricePerUnit(0);
    }
  }, [totalSellingPrice, totalUnits, profitPercent]);
  const {
    currentMedicine,
    updateCurrentMedicine,
    updateQuantity,
    addMedicine,
    clearCurrentMedicine,
  } = useMedicineStore();
  const reset = () => {
    setTotalSellingPrice("");
    setTotalUnits("");
    setProfitPercent("");
    setProfitAmount(0);
    setTotalPurchasePrice(0);
    setPurchasePricePerUnit(0);
    setSellingPricePerUnit(0);
  };

  const applyToForm = () => {
    console.log({
      purchasePrice: purchasePricePerUnit.toFixed(2),
      sellingPrice: sellingPricePerUnit.toFixed(2),
    });
    updateCurrentMedicine({
      purchasePrice: parseFloat(purchasePricePerUnit.toFixed(2)) || 0,
      sellingPrice: parseFloat(sellingPricePerUnit.toFixed(2)) || 0,
    });
    setOpen(false);
  };

  return (
    <>
      {/* Floating Button - Left Side */}
      <Button
        onClick={() => setOpen(true)}
        className=" h-12 w-12 rounded-full bg-success hover:bg-success/90 "
        size="icon"
        title="Unit Price Calculator"
      >
        <Coins className="h-10 w-10" />
      </Button>

      {/* Calculator Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Unit Price Calculator</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Input Section */}
            <div className="space-y-3 p-4 bg-light-gray rounded-lg border border-border-gray">
              <div>
                <Label
                  htmlFor="total-selling"
                  className="text-sm font-semibold"
                >
                  Total Selling Price (৳)
                </Label>
                <Input
                  id="total-selling"
                  type="number"
                  placeholder="e.g., 500"
                  value={totalSellingPrice}
                  onChange={(e) => setTotalSellingPrice(e.target.value)}
                  className="mt-1.5 h-9"
                />
              </div>

              <div>
                <Label htmlFor="total-units" className="text-sm font-semibold">
                  Total Units/Quantity
                </Label>
                <Input
                  id="total-units"
                  type="number"
                  placeholder="e.g., 200"
                  value={totalUnits}
                  onChange={(e) => setTotalUnits(e.target.value)}
                  className="mt-1.5 h-9"
                />
              </div>

              <div>
                <Label
                  htmlFor="profit-percent"
                  className="text-sm font-semibold"
                >
                  Profit/Commission (%)
                </Label>
                <Input
                  id="profit-percent"
                  type="number"
                  placeholder="e.g., 15"
                  value={profitPercent}
                  onChange={(e) => setProfitPercent(e.target.value)}
                  className="mt-1.5 h-9"
                />
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-2 p-4 bg-primary-blue/5 rounded-lg border-2 border-primary-blue">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-dark-text">
                  Total Profit:
                </span>
                <span className="text-lg font-bold text-success">
                  ৳ {profitAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-dark-text">
                  Total Purchase Cost:
                </span>
                <span className="text-lg font-bold text-dark-blue">
                  ৳ {totalPurchasePrice.toFixed(2)}
                </span>
              </div>

              <div className="h-px bg-border-gray my-2"></div>

              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-dark-blue">
                  Purchase Price/Unit:
                </span>
                <span className="text-xl font-bold text-primary-blue">
                  ৳ {purchasePricePerUnit.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-dark-blue">
                  Selling Price/Unit:
                </span>
                <span className="text-xl font-bold text-success">
                  ৳ {sellingPricePerUnit.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Calculation Breakdown */}
            {totalSellingPrice && totalUnits && (
              <div className="text-xs text-dark-text bg-slate-50 p-3 rounded border border-slate-200">
                <p className="font-semibold mb-1">Calculation:</p>
                <p>
                  • Profit: ৳{totalSellingPrice} × {profitPercent}% = ৳
                  {profitAmount.toFixed(2)}
                </p>
                <p>
                  • Total Purchase: ৳{totalSellingPrice} - ৳
                  {profitAmount.toFixed(2)} = ৳{totalPurchasePrice.toFixed(2)}
                </p>
                <p>
                  • Purchase/Unit: ৳{totalPurchasePrice.toFixed(2)} ÷{" "}
                  {totalUnits} = ৳{purchasePricePerUnit.toFixed(2)}
                </p>
                <p>
                  • Selling/Unit: ৳{totalSellingPrice} ÷ {totalUnits} = ৳
                  {sellingPricePerUnit.toFixed(2)}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={reset} variant="outline" className="flex-1">
                Clear
              </Button>
              <Button
                onClick={applyToForm}
                disabled={!purchasePricePerUnit || !sellingPricePerUnit}
                className="flex-1 bg-primary-blue hover:bg-dark-blue"
              >
                Apply to Form
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
