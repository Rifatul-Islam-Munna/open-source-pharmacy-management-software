"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Eye, X, Calendar, Phone, User, Tag } from "lucide-react";
import { Sale } from "@/@types/sells";

interface SalesModalProps {
  sale: Sale | null;
  open: boolean;
  onClose: () => void;
}

const formatCurrency = (amount: number) =>
  `${amount?.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} BDT`;

const formatDateTime = (dateString: string) =>
  new Date(dateString).toLocaleString("en-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export function SalesModal({ sale, open, onClose }: SalesModalProps) {
  if (!sale) return null;

  const totalDiscountInBDT = sale.totalDiscount;
  const remainingAmount = Math.max(sale.total - (sale.paidAmount || 0), 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* Mobile-first: full height with proper scroll, responsive width */}
      <DialogContent className="max-w-7xl max-h-[95vh] h-[95vh] sm:h-[90vh] p-0 flex flex-col max-w-full w-[100vw] sm:w-auto sm:max-w-4xl">
        {/* MOBILE HEADER - Compact with close button */}
        <DialogHeader className="p-3 sm:p-6 border-b border-border-gray flex-shrink-0">
          <div className="flex items-center justify-between gap-2 w-full">
            <DialogTitle className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
              <Eye className="h-4 w-4 sm:h-6 sm:w-6 text-primary-blue flex-shrink-0" />
              <span className="text-base sm:text-2xl font-bold text-dark-blue truncate">
                Invoice #{sale.invoiceId}
              </span>
              <Badge
                className={
                  sale.paymentStatus === "paid"
                    ? "bg-success/10 text-success border-success/20 text-xs sm:text-sm"
                    : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs sm:text-sm"
                }
              >
                {sale.paymentStatus === "paid" ? "Paid" : "Due"}
              </Badge>
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* FULLY SCROLLABLE BODY - Fixed height on mobile */}
        <ScrollArea className="flex-1 w-full overflow-auto">
          <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 min-h-0">
            {/* MOBILE INFO CARDS - Stack better on small screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              <div className="p-2 sm:p-4 bg-light-gray/40 rounded-lg flex gap-2 sm:gap-3">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-dark-text/60 mt-0.5 sm:mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-[11px] sm:text-xs text-dark-text/60 uppercase">
                    Customer
                  </p>
                  <p className="text-sm sm:text-base font-medium text-dark-blue truncate">
                    {sale.customerName || "Walk-in customer"}
                  </p>
                </div>
              </div>

              <div className="p-2 sm:p-4 bg-light-gray/40 rounded-lg flex gap-2 sm:gap-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-dark-text/60 mt-0.5 sm:mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-[11px] sm:text-xs text-dark-text/60 uppercase">
                    Phone
                  </p>
                  <p className="text-sm sm:text-base font-medium text-dark-blue truncate">
                    {sale.customerPhone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="p-2 sm:p-4 bg-light-gray/40 rounded-lg flex gap-2 sm:gap-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-dark-text/60 mt-0.5 sm:mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-[11px] sm:text-xs text-dark-text/60 uppercase">
                    Date & time
                  </p>
                  <p className="text-xs sm:text-sm sm:text-base font-medium text-dark-blue">
                    {formatDateTime(sale.createdAt)}
                  </p>
                </div>
              </div>

              <div className="p-2 sm:p-4 bg-light-gray/40 rounded-lg flex gap-2 sm:gap-3">
                <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-dark-text/60 mt-0.5 sm:mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-[11px] sm:text-xs text-dark-text/60 uppercase">
                    Payment type
                  </p>
                  <p className="text-sm sm:text-base font-medium text-dark-blue capitalize truncate">
                    {sale.paymentType || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* RESPONSIVE MEDICINES TABLE */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-dark-blue">
                Medicines ({sale.items.length})
              </h3>

              {/* Mobile: Cards | Desktop: Table */}
              <div className="border border-border-gray rounded-lg bg-white overflow-hidden">
                {/* DESKTOP TABLE */}
                <div className="hidden sm:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-light-gray">
                        <th className="text-left px-4 py-3 font-semibold text-dark-text">
                          Medicine
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-dark-text w-20">
                          Price
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-dark-text w-28">
                          Discount
                        </th>
                        <th className="text-center px-4 py-3 font-semibold text-dark-text w-12">
                          Qty
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-dark-text">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sale.items.map((item) => {
                        const perItemDiscount =
                          item.price - (item.discountPrice || item.price);
                        const totalItemDiscount =
                          perItemDiscount * item.quantity;

                        return (
                          <tr
                            key={item.medicineName}
                            className="border-t border-border-gray/60 hover:bg-light-gray/60"
                          >
                            <td className="px-4 py-3">
                              <p className="font-medium text-dark-blue truncate max-w-[200px]">
                                {item.medicineName}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-right text-dark-text">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="px-4 py-3 text-right text-red-600">
                              {totalItemDiscount > 0
                                ? `- ${formatCurrency(totalItemDiscount)}`
                                : "—"}
                            </td>
                            <td className="px-4 py-3 text-center font-medium text-dark-blue">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-dark-blue">
                              {formatCurrency(item.subtotal)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE CARDS */}
                <div className="sm:hidden space-y-2 p-3">
                  {sale.items.map((item) => {
                    const perItemDiscount =
                      item.price - (item.discountPrice || item.price);
                    const totalItemDiscount = perItemDiscount * item.quantity;

                    return (
                      <div
                        key={item.medicineName}
                        className="p-3 bg-light-gray/20 rounded-lg border border-border-gray/50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-dark-blue text-sm truncate flex-1 mr-2">
                            {item.medicineName}
                          </p>
                          <span className="text-xs font-medium text-dark-blue">
                            x{item.quantity}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span>Price:</span>
                            <span>{formatCurrency(item.price)}</span>
                          </div>
                          {totalItemDiscount > 0 && (
                            <div className="flex justify-between text-red-600">
                              <span>Discount:</span>
                              <span>-{formatCurrency(totalItemDiscount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-semibold text-dark-blue col-span-2">
                            <span>Subtotal:</span>
                            <span>{formatCurrency(item.subtotal)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <Separator />

            {/* RESPONSIVE MONEY SUMMARY */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* BREAKDOWN */}
              <div className="space-y-2 p-3 sm:p-4 bg-light-gray/40 rounded-lg">
                <div className="flex justify-between text-xs sm:text-sm text-dark-text">
                  <span>Subtotal (before discount)</span>
                  <span className="font-semibold">
                    {formatCurrency(sale.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-xs sm:text-sm text-dark-text">
                  <span>Extra discount</span>
                  <span className="font-semibold text-red-600">
                    -{formatCurrency(sale?.discountAmount)}
                  </span>
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between text-sm sm:text-base text-dark-blue">
                  <span>Total After Discount</span>
                  <span className="font-semibold  text-green-700">
                    {formatCurrency(sale?.total)}
                  </span>
                </div>
              </div>

              {/* TOTALS */}
              <div className="space-y-2 p-3 sm:p-4 bg-primary-blue/5 rounded-lg lg:col-span-2">
                <div className="flex justify-between text-sm sm:text-lg font-semibold text-dark-blue">
                  <span>Final amount</span>
                  <span>{formatCurrency(sale.total)}</span>
                </div>

                <div className="flex justify-between text-xs sm:text-sm text-dark-text">
                  <span>Paid amount</span>
                  <span className="font-semibold">
                    {sale.paidAmount
                      ? formatCurrency(sale.paidAmount)
                      : "0.00 BDT"}
                  </span>
                </div>

                <div className="flex justify-between text-xs sm:text-sm text-dark-text">
                  <span>Status</span>
                  <span className="font-semibold capitalize">
                    {sale.paymentStatus}
                  </span>
                </div>

                {remainingAmount > 0 && (
                  <div className="flex justify-between text-sm font-semibold text-yellow-700 pt-1">
                    <span>Still due</span>
                    <span>{formatCurrency(remainingAmount)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER INFO */}
            <div className="pt-3 sm:pt-4 space-y-1">
              <p className="text-xs sm:text-sm text-dark-text/60">Issued by</p>
              <p className="text-xs sm:text-sm font-medium text-dark-blue">
                {sale.issuedBy}
              </p>

              {sale.transactionId && (
                <div className="pt-2">
                  <p className="text-xs sm:text-sm text-dark-text/60">
                    Transaction ID
                  </p>
                  <p className="text-xs sm:text-sm font-mono bg-light-gray px-2 sm:px-3 py-1 rounded break-all inline-block">
                    {sale.transactionId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
