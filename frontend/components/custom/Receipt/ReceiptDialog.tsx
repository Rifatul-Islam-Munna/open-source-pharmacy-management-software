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

interface MedicineItem {
  no: number;
  particulars: string;
  rate: number;
  qty: number;
  mrp: number;
  disc: number;
  price: number;
}

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReceiptDialog({
  open,
  onOpenChange,
}: ReceiptDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const receiptData = {
    invoiceNo: "54654",
    date: "6/11/2025 12:02:01 PM",
    customerName: "",
    customerAddress: "",
    items: [
      {
        no: 1,
        particulars: "Empalina 10/5 mg Tab [2×10s]",
        rate: 30.0,
        qty: 10,
        mrp: 300.0,
        disc: 30.0,
        price: 270.0,
      },
      {
        no: 2,
        particulars: "Comprid XR 60mg Tab [3×10s]",
        rate: 12.0,
        qty: 10,
        mrp: 120.0,
        disc: 12.0,
        price: 108.0,
      },
    ],
    subTotal: 378.0,
    totalMRP: 420.0,
    totalDisc: 42.0,
    total: 378.0,
    totalDiscount: 42.0,
    adjustment: 0.0,
    netAmount: 378.0,
    paidAmount: 378.0,
    receivedBy: "AHOSAN",
    paymentMethod: "Cash",
    counter: "COUNTER02",
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    // Use html2canvas-pro instead
    const html2canvas = (await import("html2canvas-pro")).default;
    const jsPDF = (await import("jspdf")).default;

    const canvas = await html2canvas(receiptRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    // Calculate actual height from canvas
    const imgWidth = 85; // 58mm width for thermal receipt
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add margins (2mm on all sides)
    const margin = 2;
    const pdfWidth = imgWidth;
    const pdfHeight = imgHeight + margin * 2; // Add top + bottom margin

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [pdfWidth, pdfHeight], // 🔥 NOW it's truly auto height!
      compress: true,
    });

    // Add image with margins
    pdf.addImage(
      imgData,
      "JPEG",
      margin,
      margin,
      imgWidth - margin * 2,
      imgHeight
    );
    pdf.save(`receipt-${receiptData.invoiceNo}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[280px] p-0">
        <DialogHeader className="p-4 pb-0 print:hidden">
          <DialogTitle>Receipt Preview</DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto p-4">
          {/* Receipt Container */}
          <div ref={receiptRef} className="w-full font-mono">
            {/* Header */}
            <div className="text-center border-b border-black pb-1 mb-1">
              <h2 className="text-base font-bold m-0">Haque Pharmacy</h2>
              <p className="text-[10px] m-0">
                Kazi Nazrul Islam Road, Jhawtola Bogura-5800
              </p>
              <p className="text-[10px] m-0">Mobile No: 01713-991175</p>
            </div>

            {/* Invoice Info */}
            <div className="text-[10px] my-1">
              <div className="flex justify-between items-center mb-1">
                <span className="border border-black px-1 py-0.5">
                  {receiptData.invoiceNo}
                </span>
                <span>Cash Memo</span>
                <span className="border border-black px-1 py-0.5">
                  Customer Copy
                </span>
              </div>
              <div>Date/Time: {receiptData.date}</div>
            </div>

            {/* Customer Info */}
            <div className="text-[10px] border-t border-b border-black py-1 my-1">
              <div>Name: {receiptData.customerName || ""}</div>
              <div>Address: {receiptData.customerAddress || ""}</div>
            </div>

            {/* Items Table */}
            <table className="w-full text-[9px] border-collapse my-1">
              <thead>
                <tr className="border-b border-gray-400">
                  <th className="text-left px-0.5 py-0.5 w-4">No</th>
                  <th className="text-left px-0.5 py-0.5">Particulars</th>
                  <th className="text-right px-0.5 py-0.5">Rate</th>
                  <th className="text-right px-0.5 py-0.5">Qty</th>
                  <th className="text-right px-0.5 py-0.5">MRP</th>
                  <th className="text-right px-0.5 py-0.5">Disc</th>
                  <th className="text-right px-0.5 py-0.5">Price</th>
                </tr>
              </thead>
              <tbody>
                {receiptData.items.map((item) => (
                  <tr key={item.no} className="border-b border-gray-300">
                    <td className="text-left px-0.5 py-0.5">{item.no}</td>
                    <td className="text-left px-0.5 py-0.5 text-[9px] break-words">
                      {item.particulars}
                    </td>
                    <td className="text-right px-0.5 py-0.5">
                      {item.rate.toFixed(2)}
                    </td>
                    <td className="text-right px-0.5 py-0.5">{item.qty}</td>
                    <td className="text-right px-0.5 py-0.5">
                      {item.mrp.toFixed(2)}
                    </td>
                    <td className="text-right px-0.5 py-0.5">
                      {item.disc.toFixed(2)}
                    </td>
                    <td className="text-right px-0.5 py-0.5">
                      {item.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="border-t border-b border-black py-1 text-[10px]">
              <div className="flex justify-between gap-2">
                <span>Sub Total</span>
                <span className="flex-1 text-right">
                  {receiptData.totalMRP.toFixed(2)}
                </span>
                <span className="w-12 text-right">
                  {receiptData.totalDisc.toFixed(1)}
                </span>
                <span className="w-12 text-right">
                  {receiptData.subTotal.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between gap-2 font-bold">
                <span>Total</span>
                <span className="flex-1 text-right">
                  {receiptData.totalMRP.toFixed(2)}
                </span>
                <span className="w-12 text-right">
                  {receiptData.totalDisc.toFixed(1)}
                </span>
                <span className="w-12 text-right">
                  {receiptData.total.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="my-1 text-[11px]">
              <div className="flex justify-between py-0.5">
                <span>Total Discount</span>
                <span>{receiptData.totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>Adjustment:</span>
                <span>{receiptData.adjustment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-0.5 font-bold">
                <span>Net Amount:</span>
                <span>{receiptData.netAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-0.5 font-bold">
                <span>Paid Amount:</span>
                <span>{receiptData.paidAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-black pt-1 mt-2">
              <div className="flex justify-between items-center mb-1 text-[10px]">
                <span className="font-bold">{receiptData.receivedBy}</span>
                <span className="text-xs">────────</span>
                <span className="font-bold">{receiptData.paymentMethod}</span>
              </div>
              <div className="text-[10px]">PC: {receiptData.counter}</div>
            </div>

            {/* Bengali Text */}
            <div className="text-[8px] leading-tight border-t border-b border-dashed border-black py-1 my-1">
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
            <div className="text-center text-[8px] mt-1 mb-2">
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
          >
            📥 Download PDF
          </Button>
          <Button
            onClick={handlePrint}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            🖨️ Print Now
          </Button>
        </div>

        {/* Pure CSS Styles - No Tailwind/oklch colors */}
        <style jsx global>{`
          /* Reset and Base */
          * {
            box-sizing: border-box;
          }

          /* Layout */
          .flex {
            display: flex;
          }

          .justify-between {
            justify-content: space-between;
          }

          .items-center {
            align-items: center;
          }

          .text-center {
            text-align: center;
          }

          .text-left {
            text-align: left;
          }

          .text-right {
            text-align: right;
          }

          /* Width */
          .w-full {
            width: 100%;
          }

          .w-4 {
            width: 1rem;
          }

          .w-12 {
            width: 3rem;
          }

          .flex-1 {
            flex: 1 1 0%;
          }

          .max-w-\[280px\] {
            max-width: 280px;
          }

          /* Height */
          .max-h-\[70vh\] {
            max-height: 70vh;
          }

          /* Overflow */
          .overflow-y-auto {
            overflow-y: auto;
          }

          /* Spacing - Padding */
          .p-0 {
            padding: 0;
          }

          .p-4 {
            padding: 1rem;
          }

          .px-0\.5 {
            padding-left: 0.125rem;
            padding-right: 0.125rem;
          }

          .px-1 {
            padding-left: 0.25rem;
            padding-right: 0.25rem;
          }

          .py-0\.5 {
            padding-top: 0.125rem;
            padding-bottom: 0.125rem;
          }

          .py-1 {
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
          }

          .pb-0 {
            padding-bottom: 0;
          }

          .pb-1 {
            padding-bottom: 0.25rem;
          }

          .pt-0 {
            padding-top: 0;
          }

          .pt-1 {
            padding-top: 0.25rem;
          }

          /* Spacing - Margin */
          .m-0 {
            margin: 0;
          }

          .mb-1 {
            margin-bottom: 0.25rem;
          }

          .mb-2 {
            margin-bottom: 0.5rem;
          }

          .mt-1 {
            margin-top: 0.25rem;
          }

          .mt-2 {
            margin-top: 0.5rem;
          }

          .my-1 {
            margin-top: 0.25rem;
            margin-bottom: 0.25rem;
          }

          /* Gap */
          .gap-2 {
            gap: 0.5rem;
          }

          .space-y-2 > * + * {
            margin-top: 0.5rem;
          }

          /* Typography */
          .font-mono {
            font-family: "Courier New", monospace;
          }

          .font-bold {
            font-weight: 700;
          }

          .text-base {
            font-size: 1rem;
            line-height: 1.5rem;
          }

          .text-xs {
            font-size: 0.75rem;
            line-height: 1rem;
          }

          .text-\[8px\] {
            font-size: 8px;
          }

          .text-\[9px\] {
            font-size: 9px;
          }

          .text-\[10px\] {
            font-size: 10px;
          }

          .text-\[11px\] {
            font-size: 11px;
          }

          .leading-tight {
            line-height: 1.25;
          }

          .break-words {
            overflow-wrap: break-word;
          }

          /* Borders */
          .border {
            border-width: 1px;
            border-style: solid;
          }

          .border-t {
            border-top-width: 1px;
            border-top-style: solid;
          }

          .border-b {
            border-bottom-width: 1px;
            border-bottom-style: solid;
          }

          .border-black {
            border-color: #000000;
          }

          .border-gray-300 {
            border-color: #d1d5db;
          }

          .border-gray-400 {
            border-color: #9ca3af;
          }

          .border-dashed {
            border-style: dashed;
          }

          .border-collapse {
            border-collapse: collapse;
          }

          /* Button Colors - RGB instead of oklch */
          .bg-blue-600 {
            background-color: #2563eb;
          }

          .bg-blue-600:hover,
          .hover\:bg-blue-700:hover {
            background-color: #1d4ed8;
          }

          .bg-green-600 {
            background-color: #16a34a;
          }

          .bg-green-600:hover,
          .hover\:bg-green-700:hover {
            background-color: #15803d;
          }

          /* Print Styles */
          @media print {
            @page {
              size: 58mm auto;
              margin: 0;
            }

            body * {
              visibility: hidden;
            }

            #receipt,
            #receipt * {
              visibility: visible;
            }

            #receipt {
              position: absolute;
              left: 0;
              top: 0;
              width: 58mm;
              padding: 2mm;
              font-family: "Courier New", monospace;
            }

            .print\:hidden {
              display: none !important;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
