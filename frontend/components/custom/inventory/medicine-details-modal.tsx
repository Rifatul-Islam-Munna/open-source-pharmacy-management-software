// components/medicine-details-modal.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, Package, Calendar, DollarSign, Hash, Pill } from "lucide-react";
import { Medicine } from "@/@types/inventory";

interface MedicineDetailsModalProps {
  medicine: Medicine;
  trigger?: React.ReactNode;
}

export function MedicineDetailsModal({
  medicine,
  trigger,
}: MedicineDetailsModalProps) {
  const [open, setOpen] = useState(false);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get stock status
  const getStockStatus = (units: number) => {
    if (units >= 5) {
      return {
        label: "In Stock",
        className: "bg-success/10 text-success border-success/20",
      };
    } else if (units > 0) {
      return {
        label: "Low Stock",
        className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      };
    } else {
      return {
        label: "Out of Stock",
        className: "bg-red-500/10 text-red-600 border-red-500/20",
      };
    }
  };

  const stockStatus = getStockStatus(medicine.totalUnits);

  return (
    <>
      {/* Trigger Button */}
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        )}
      </div>

      {/* Modal with 80% width */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[80%] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-dark-blue">
              Medicine Details
            </DialogTitle>
            <DialogDescription className="text-dark-text">
              Complete information about this medicine batch
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Product Information */}
            <div className="bg-light-gray p-4 rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-dark-blue mb-1">
                    {medicine?.shopMedicineId?.name}
                  </h3>
                  <p className="text-sm text-dark-text">
                    {medicine?.shopMedicineId?.generic}
                  </p>
                </div>
                <Badge className={stockStatus.className}>
                  {stockStatus?.label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Pill className="h-4 w-4 text-primary-blue" />
                  <div>
                    <p className="text-xs text-dark-text">Dosage Type</p>
                    <p className="font-medium text-dark-blue">
                      {medicine?.shopMedicineId?.dosageType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-primary-blue" />
                  <div>
                    <p className="text-xs text-dark-text">Strength</p>
                    <p className="font-medium text-dark-blue">
                      {medicine?.shopMedicineId?.strength}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Hash className="h-4 w-4 text-primary-blue" />
                  <div>
                    <p className="text-xs text-dark-text">Batch Number</p>
                    <p className="font-medium text-dark-blue">
                      {medicine?.batchNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-primary-blue" />
                  <div>
                    <p className="text-xs text-dark-text">Manufacturer</p>
                    <p className="font-medium text-dark-blue">
                      {medicine?.shopMedicineId?.manufacturer}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-border-gray" />

            {/* Pricing & Stock */}
            <div className="grid grid-cols-1 @md:grid-cols-3 gap-4">
              <div className="bg-white border border-border-gray rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-success" />
                  <p className="text-sm text-dark-text">Purchase Price</p>
                </div>
                <p className="text-2xl font-bold text-dark-blue">
                  {medicine?.purchasePrice?.toFixed(2)}
                </p>
              </div>

              <div className="bg-white border border-border-gray rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-primary-blue" />
                  <p className="text-sm text-dark-text">Selling Price</p>
                </div>
                <p className="text-2xl font-bold text-dark-blue">
                  {medicine?.sellingPrice?.toFixed(2)}
                </p>
              </div>

              <div className="bg-white border border-border-gray rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-dark-blue" />
                  <p className="text-sm text-dark-text">Total Units</p>
                </div>
                <p className="text-2xl font-bold text-dark-blue">
                  {medicine?.totalUnits}
                </p>
              </div>
            </div>

            <Separator className="bg-border-gray" />

            {/* Quantity Breakdown */}
            <div>
              <h4 className="text-lg font-semibold text-dark-blue mb-3">
                Quantity Breakdown
              </h4>
              <div className="grid grid-cols-2 @md:grid-cols-4 gap-4">
                <div className="bg-light-gray p-3 rounded-lg">
                  <p className="text-xs text-dark-text mb-1">Boxes</p>
                  <p className="text-xl font-bold text-primary-blue">
                    {medicine?.quantity?.boxes}
                  </p>
                </div>

                <div className="bg-light-gray p-3 rounded-lg">
                  <p className="text-xs text-dark-text mb-1">Cartons/Box</p>
                  <p className="text-xl font-bold text-primary-blue">
                    {medicine?.quantity?.cartonPerBox}
                  </p>
                </div>

                <div className="bg-light-gray p-3 rounded-lg">
                  <p className="text-xs text-dark-text mb-1">Strips/Carton</p>
                  <p className="text-xl font-bold text-primary-blue">
                    {medicine?.quantity?.stripsPerCarton}
                  </p>
                </div>

                <div className="bg-light-gray p-3 rounded-lg">
                  <p className="text-xs text-dark-text mb-1">Units/Strip</p>
                  <p className="text-xl font-bold text-primary-blue">
                    {medicine?.quantity?.unitsPerStrip}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="bg-border-gray" />

            {/* Dates */}
            <div className="grid grid-cols-1 @md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary-blue" />
                <div>
                  <p className="text-xs text-dark-text">Expiry Date</p>
                  <p className="font-semibold text-dark-blue">
                    {formatDate(medicine?.expiryDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-dark-text" />
                <div>
                  <p className="text-xs text-dark-text">Created At</p>
                  <p className="font-medium text-dark-blue">
                    {formatDate(medicine?.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-dark-text" />
                <div>
                  <p className="text-xs text-dark-text">Last Updated</p>
                  <p className="font-medium text-dark-blue">
                    {formatDate(medicine?.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border-gray">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border-gray hover:bg-light-gray"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
