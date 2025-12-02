// components/ReceiptDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Sale, SaleItem } from "@/stores/sales-store";
import { useReactToPrint } from "react-to-print";
// adjust path

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Sale | null; // can be null
}

export default function ReceiptDialog({
  open,
  onOpenChange,
  sale,
}: ReceiptDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  // Build a safe view-model with fallbacks so null is handled cleanly
  const invoiceNo = sale?.invoiceId ?? "N/A";
  const dateTime = sale
    ? new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "";

  const customerName = sale?.customerName ?? "";
  const customerAddress = sale?.customerPhone
    ? `Mob: ${sale.customerPhone}`
    : "";

  const items: SaleItem[] = sale?.items ?? [];

  // FIXED CALCULATIONS - No double discounting
  const totalMRP = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemsDiscount = sale?.itemsDiscount ?? 0;
  const subTotal = sale?.subtotal ?? totalMRP - itemsDiscount; // Already has items discount
  const total = sale?.total ?? subTotal; // Final total after all discounts (including global)
  const paidAmount = sale?.paidAmount ?? 0;
  const dueAmount = total - paidAmount;

  const paymentMethod =
    sale?.paymentType === "online"
      ? "Online"
      : sale?.paymentType === "cash"
      ? "Cash"
      : "N/A";

  const receivedBy = sale?.issuedBy || "N/A";
  const counter = "COUNTER01";

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    const html2canvas = (await import("html2canvas-pro")).default;
    const jsPDF = (await import("jspdf")).default;

    const canvas = await html2canvas(receiptRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    // Wider thermal receipt: 80mm (instead of 58mm)
    const imgWidth = 80; // 80mm width for better standard
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const margin = 2;
    const pdfWidth = imgWidth;
    const pdfHeight = imgHeight + margin * 2;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [pdfWidth, pdfHeight],
      compress: true,
    });

    pdf.addImage(
      imgData,
      "JPEG",
      margin,
      margin,
      imgWidth - margin * 2,
      imgHeight
    );
    pdf.save(`receipt-${invoiceNo}.pdf`);
  };

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    pageStyle: `
        @page { size: 80mm ${receiptRef?.current?.scrollHeight}; margin: 0; padding:10px }
      #receipt { padding: 0; margin:  0; }
      #receipt * {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      `,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[360px] p-0">
        <DialogHeader className="p-4 pb-0 print:hidden">
          <DialogTitle>Receipt Preview</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {/* Receipt Container */}
          <div ref={receiptRef} id="receipt" className="w-full font-mono">
            {/* Header */}
            <div className="text-center border-b border-black pb-1 mb-1">
              <h2 className="text-lg font-bold m-0">Haque Pharmacy</h2>
              <p className="text-sm m-0">
                Kazi Nazrul Islam Road, Jhawtola Bogura-5800
              </p>
              <p className="text-sm m-0">Mobile No: 01713-991175</p>
            </div>

            {/* Invoice Info */}
            <div className="text-sm my-1">
              <div className="flex justify-between items-center mb-1">
                <span className="border border-black px-1 py-0.5">
                  {invoiceNo}
                </span>
                <span>Cash Memo</span>
                <span className="border border-black px-1 py-0.5">
                  Customer Copy
                </span>
              </div>
              <div>Date/Time: {dateTime}</div>
            </div>

            {/* Customer Info */}
            <div className="text-sm border-t border-b border-black py-1 my-1">
              <div>Name: {customerName}</div>
              <div> {customerAddress}</div>
            </div>

            {/* Items Table */}
            <table className="w-full text-[10px] border-collapse my-1">
              <thead>
                <tr className="border-b border-gray-400">
                  <th className="text-left px-1 py-0.5 w-6">No</th>
                  <th className="text-left px-1 py-0.5 flex-1 min-w-0">
                    Particulars
                  </th>
                  <th className="text-right px-1 py-0.5 w-10">Rate</th>
                  <th className="text-right px-1 py-0.5 w-8">Qty</th>
                  <th className="text-right px-1 py-0.5 w-12">MRP</th>
                  <th className="text-right px-1 py-0.5 w-10">Disc</th>
                  <th className="text-right px-1 py-0.5 w-12">Price</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-[10px] py-2">
                      No items
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => {
                    const lineMrp = item.price * item.quantity;
                    const linePrice = item.subtotal;
                    const lineDisc = lineMrp - linePrice;

                    return (
                      <tr
                        key={item.id ?? index}
                        className="border-b border-gray-300"
                      >
                        <td className="text-left px-1 py-0.5">{index + 1}</td>
                        <td className="text-left px-1 py-0.5 text-[10px] wrap-break-word">
                          {item.medicineName}{" "}
                          <span className=" font-bold">({item?.doesType})</span>
                        </td>
                        <td className="text-right px-1 py-0.5">
                          {item.price.toFixed(2)}
                        </td>
                        <td className="text-right px-1 py-0.5">
                          {item.quantity}
                        </td>
                        <td className="text-right px-1 py-0.5">
                          {lineMrp.toFixed(2)}
                        </td>
                        <td className="text-right px-1 py-0.5">
                          {lineDisc.toFixed(2)}
                        </td>
                        <td className="text-right px-1 py-0.5">
                          {linePrice.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Totals - SIMPLIFIED */}
            <div className="border-t border-b border-black py-1 text-sm">
              <div className="flex justify-between gap-2 mb-1">
                <span>Sub Total</span>
                <span className="flex-1 text-right">{totalMRP.toFixed(2)}</span>
                <span className="w-14 text-right">
                  {itemsDiscount.toFixed(1)}
                </span>
                <span className="w-14 text-right">{subTotal.toFixed(1)}</span>
              </div>
              <div className="flex justify-between gap-2 font-bold">
                <span>Total</span>
                <span className="flex-1 text-right">{totalMRP.toFixed(2)}</span>
                <span className="w-14 text-right">
                  {" "}
                  - {sale?.discountAmount}
                </span>
                <span className="w-14 text-right">{total.toFixed(1)}</span>
              </div>
            </div>

            {/* Payment Details - FIXED with Due Status */}
            <div className="my-1 text-base">
              <div className="flex justify-between py-0.5">
                <span>Items Discount</span>
                <span>{itemsDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-0.5 font-bold border-t border-gray-400 pt-1">
                <span>Total Amount:</span>
                <span>৳{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-0.5 font-bold">
                <span>Paid Amount:</span>
                <span>৳{paidAmount.toFixed(2)}</span>
              </div>
              <div
                className={`flex justify-between py-0.5 font-bold ${
                  dueAmount > 0 ? "text-red-600" : ""
                }`}
              >
                <span>Due Amount:</span>
                <span>
                  {dueAmount > 0 ? `৳${dueAmount.toFixed(2)}` : "Paid"}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-black pt-1 mt-2">
              <div className="flex justify-between items-center mb-1 text-sm">
                <span className="font-bold">{receivedBy}</span>
                <span className="text-xs">────────────</span>
                <span className="font-bold">{paymentMethod}</span>
              </div>
              <div className="text-sm">PC: {counter}</div>
            </div>

            {/* Bengali Text */}
            <div className="text-[9px] leading-tight border-t border-b border-dashed border-black py-1 my-1">
              <p className="m-0">
                **সালের শেষের ছাড় উত্তর বেরাবর গোনার হর না।*
              </p>
              <p className="m-0">
                **ফলে আপাচন রহ্মতা ঔষ্চর জন্য সম্পূর্ণ মাদকে।
              </p>
              <p className="m-0">
                **পরীক্ষের পূর্বে, ক্যাপসিউল, ভিটামিন, শুধু এবং দ্রব্য আউট্রা
              </p>
              <p className="m-0">পরীক্ষের পরে পরিবর্তনযোগ্য নয়।</p>
            </div>

            {/* Developer Info */}
            <div className="text-center text-[9px] mt-1 mb-2">
              Software Developed by RIfat, Mob: 01907565617
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="p-4 pt-0 print:hidden space-y-2">
          <Button
            onClick={handleDownloadPDF}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
            disabled={!sale}
          >
            📥 Download PDF
          </Button>
          <Button
            onClick={handlePrint}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
            disabled={!sale}
          >
            🖨️ Print Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
