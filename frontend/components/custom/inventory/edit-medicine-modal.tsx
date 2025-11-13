// components/edit-medicine-modal.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";

import { toast } from "sonner";
import { Medicine } from "@/@types/inventory";
import { useCommonMutationApi } from "@/api-hooks/mutation-common";
import { useQueryClient } from "@tanstack/react-query";

interface EditMedicineModalProps {
  medicine: Medicine;
  trigger?: React.ReactNode;
}

export function EditMedicineModal({
  medicine,
  trigger,
}: EditMedicineModalProps) {
  const [open, setOpen] = useState(false);

  // ✅ Store as strings to preserve decimal input
  const [formData, setFormData] = useState({
    totalUnits: medicine.totalUnits.toString(),
    sellingPrice: medicine.sellingPrice.toString(),
    purchasePrice: medicine.purchasePrice.toString(),
  });

  // Reset form when modal opens
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setFormData({
        totalUnits: medicine.totalUnits.toString(),
        sellingPrice: medicine.sellingPrice.toString(),
        purchasePrice: medicine.purchasePrice.toString(),
      });
    }
  };

  const query = useQueryClient();

  const updateMutation = useCommonMutationApi({
    url: `/shop/update-shop-medicine`,
    method: "PATCH",
    successMessage: "Medicine updated successfully!",
    onSuccess: () => {
      setOpen(false);
      query.refetchQueries({ queryKey: ["get-my-inventory"] });
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Convert to numbers for validation and submission
    const totalUnits = parseFloat(formData.totalUnits) || 0;
    const sellingPrice = parseFloat(formData.sellingPrice) || 0;
    const purchasePrice = parseFloat(formData.purchasePrice) || 0;

    // Validation
    if (totalUnits < 0) {
      toast.error("Total units cannot be negative");
      return;
    }

    if (sellingPrice <= 0 || purchasePrice <= 0) {
      toast.error("Prices must be greater than zero");
      return;
    }

    if (sellingPrice < purchasePrice) {
      toast.warning("Selling price is lower than purchase price");
    }

    const finalData = {
      totalUnits,
      sellingPrice,
      purchasePrice,
      id: medicine._id,
    };

    updateMutation.mutate(finalData);
  };

  // ✅ Handle input changes - now works with decimals
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value, // Store as-is (string)
    }));
  };

  // ✅ Calculate profit margin - parse strings to numbers
  const sellingPrice = parseFloat(formData.sellingPrice) || 0;
  const purchasePrice = parseFloat(formData.purchasePrice) || 0;
  const totalUnits = parseFloat(formData.totalUnits) || 0;

  const profitMargin =
    sellingPrice > 0
      ? (((sellingPrice - purchasePrice) / sellingPrice) * 100).toFixed(2)
      : "0";

  return (
    <>
      {/* Trigger Button */}
      <div onClick={() => setOpen(true)} className="cursor-pointer w-full">
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-dark-blue">
              Edit Medicine
            </DialogTitle>
            <DialogDescription className="text-dark-text">
              Update stock quantity and pricing information
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Medicine Info (Read-only) */}
              <div className="bg-light-gray p-3 rounded-lg">
                <p className="text-sm font-semibold text-dark-blue">
                  {medicine.shopMedicineId.name}
                </p>
                <p className="text-xs text-dark-text">
                  Batch: {medicine.batchNumber}
                </p>
              </div>

              {/* Total Units */}
              <div className="space-y-2">
                <Label htmlFor="totalUnits" className="text-dark-text">
                  Total Units *
                </Label>
                <Input
                  id="totalUnits"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.totalUnits}
                  onChange={(e) => handleChange("totalUnits", e.target.value)}
                  className="border-border-gray focus:border-primary-blue"
                  required
                />
                <p className="text-xs text-dark-text">Current stock quantity</p>
              </div>

              {/* Purchase Price */}
              <div className="space-y-2">
                <Label htmlFor="purchasePrice" className="text-dark-text">
                  Purchase Price ($) *
                </Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.purchasePrice}
                  onChange={(e) =>
                    handleChange("purchasePrice", e.target.value)
                  }
                  className="border-border-gray focus:border-primary-blue"
                  required
                />
                <p className="text-xs text-dark-text">Cost per unit</p>
              </div>

              {/* Selling Price */}
              <div className="space-y-2">
                <Label htmlFor="sellingPrice" className="text-dark-text">
                  Selling Price ($) *
                </Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) => handleChange("sellingPrice", e.target.value)}
                  className="border-border-gray focus:border-primary-blue"
                  required
                />
                <p className="text-xs text-dark-text">Price per unit</p>
              </div>

              {/* Profit Margin Display */}
              <div className="bg-light-gray p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-dark-text">Profit Margin:</span>
                  <span
                    className={`text-sm font-semibold ${
                      parseFloat(profitMargin) > 0
                        ? "text-success"
                        : parseFloat(profitMargin) < 0
                        ? "text-red-600"
                        : "text-dark-text"
                    }`}
                  >
                    {profitMargin}%
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-dark-text">
                    Profit per unit:
                  </span>
                  <span className="text-sm font-semibold text-dark-blue">
                    ${(sellingPrice - purchasePrice).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-dark-text">Total value:</span>
                  <span className="text-sm font-semibold text-dark-blue">
                    ${(sellingPrice * totalUnits).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={updateMutation.isPending}
                className="border-border-gray hover:bg-light-gray"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="bg-primary-blue hover:bg-dark-blue text-white"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
