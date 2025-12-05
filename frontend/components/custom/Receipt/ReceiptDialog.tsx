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
import { useUser } from "@/hooks/useUser";

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Sale | null;
}

export default function ReceiptDialog({
  open,
  onOpenChange,
  sale,
}: ReceiptDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

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

  const totalMRP = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemsDiscount = sale?.itemsDiscount ?? 0;
  const subTotal = sale?.subtotal ?? totalMRP - itemsDiscount;
  const total = sale?.total ?? subTotal;
  const paidAmount = sale?.paidAmount ?? 0;
  const dueAmount = total - paidAmount;
  const { user, loading, error, refetch } = useUser();

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
    const imgWidth = 85;
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

  const heightInPixels = receiptRef.current?.scrollHeight || 0;
  const heightInMM = (heightInPixels * 25.4) / 96;
  console.log(heightInMM);
  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    pageStyle: `
      @page { 
        size: 85mm ${heightInMM}mm; 
        margin: 0; 
      }
      body { 
        margin: 0; 
        padding: 0; 
      }
      #receipt { 
        padding: 5px; 
        margin: 0;
        width: 85mm;
      }
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
          <div
            ref={receiptRef}
            id="receipt"
            className="w-full font-mono text-[8pt]"
          >
            {/* Header - Font A (12pt) */}
            <div className="text-center border-b border-black pb-1 mb-1">
              <h2 className="text-[11pt] font-bold m-0 leading-tight">
                {user?.shopName ?? "N/A"}
              </h2>
              <p className="text-[8pt] m-0 leading-tight">
                {user?.location ?? "N/A"}
              </p>
              <p className="text-[8pt] m-0 leading-tight">
                Mobile No: {user?.phone ?? "N/A"}
              </p>
            </div>

            {/* Invoice Info - Font B (9pt) */}
            <div className="text-[8pt] my-0.5">
              <div className="flex justify-between items-center mb-0.5 text-[7pt]">
                <span className="border border-black px-0.5 py-0">
                  {invoiceNo}
                </span>
                <span>Cash Memo</span>
                <span className="border border-black px-0.5 py-0">
                  Customer Copy
                </span>
              </div>
              <div className="text-[7pt]">Date/Time: {dateTime}</div>
            </div>

            {/* Customer Info */}
            <div className="text-[8pt] border-t border-b border-black py-0.5 my-0.5">
              <div>Name: {customerName}</div>
              <div>{customerAddress}</div>
            </div>

            {/* Items Table - Very small (7pt) */}
            <table className="w-full text-[7pt] border-collapse my-0.5">
              <thead>
                <tr className="border-b border-gray-400">
                  <th className="text-left px-0.5 py-0.5 w-4">No</th>
                  <th className="text-left px-0.5 py-0.5 flex-1 min-w-0">
                    Particulars
                  </th>
                  <th className="text-right px-0.5 py-0.5 w-8">Rate</th>
                  <th className="text-right px-0.5 py-0.5 w-6">Qty</th>
                  <th className="text-right px-0.5 py-0.5 w-10">MRP</th>
                  <th className="text-right px-0.5 py-0.5 w-8">Disc</th>
                  <th className="text-right px-0.5 py-0.5 w-10">Price</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-1">
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
                        <td className="text-left px-0.5 py-0.5">{index + 1}</td>
                        <td className="text-left px-0.5 py-0.5 text-[6pt] break-words">
                          {item.medicineName}{" "}
                          <span className="font-semibold">
                            ({item?.doesType})
                          </span>
                          <span className=" text-[4pt]">{item.strength}</span>
                        </td>
                        <td className="text-right px-0.5 py-0.5">
                          {item.price.toFixed(1)}
                        </td>
                        <td className="text-right px-0.5 py-0.5">
                          {item.quantity}
                        </td>
                        <td className="text-right px-0.5 py-0.5">
                          {lineMrp.toFixed(1)}
                        </td>
                        <td className="text-right px-0.5 py-0.5">
                          {lineDisc.toFixed(1)}
                        </td>
                        <td className="text-right px-0.5 py-0.5">
                          {linePrice.toFixed(1)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Totals - Smaller (8pt) */}
            <div className="border-t border-b border-black py-0.5 text-[8pt]">
              <div className="flex justify-between gap-1 mb-0.5">
                <span>Sub Total</span>
                <span className="flex-1 text-right">{totalMRP.toFixed(1)}</span>
                <span className="w-12 text-right">
                  {itemsDiscount.toFixed(1)}
                </span>
                <span className="w-12 text-right">{subTotal.toFixed(1)}</span>
              </div>
              <div className="flex justify-between gap-1 font-bold">
                <span>Total</span>
                <span className="flex-1 text-right">{totalMRP.toFixed(1)}</span>
                <span className="w-12 text-right">
                  -{sale?.discountAmount ?? 0}
                </span>
                <span className="w-12 text-right">{total.toFixed(1)}</span>
              </div>
            </div>

            {/* Payment Details - Reduced (9pt) */}
            <div className="my-0.5 text-[9pt]">
              <div className="flex justify-between py-0.5">
                <span>Items Discount</span>
                <span>{itemsDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-0.5 font-bold border-t border-gray-400 pt-0.5">
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
            <div className="border-t border-black pt-0.5 mt-1">
              <div className="flex justify-between items-center mb-0.5 text-[8pt]">
                <span className="font-bold">{receivedBy}</span>
                <span className="text-[7pt]">────────────</span>
                <span className="font-bold">{paymentMethod}</span>
              </div>
              {/*      <div className="text-[8pt]">PC: {counter}</div> */}
            </div>

            {/* Bengali Text */}
            <div className="text-[7pt] leading-tight border-t border-b border-dashed border-black py-0.5 my-0.5">
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
            <div className="text-center text-[7pt] mt-0.5 mb-1">
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
