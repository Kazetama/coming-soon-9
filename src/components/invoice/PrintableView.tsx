import React from "react";
import { format } from "date-fns";
import { InvoiceDetails, InvoiceItem } from "@/types/invoice";

interface PrintableViewProps {
  details: InvoiceDetails;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
}

export const PrintableView = React.forwardRef<HTMLDivElement, PrintableViewProps>(
  ({ details, items, subtotal, taxAmount, grandTotal }, ref) => {
    return (
      <div ref={ref} className="bg-white text-black p-10 font-sans min-h-[1100px] w-full max-w-[800px] mx-auto">
        <div className="flex justify-between items-start border-b-2 border-[#e2e8f0] pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#1e293b] mb-2">INVOICE</h1>
            <p className="text-[#64748b] font-medium">{details.invoiceNumber ? `#${details.invoiceNumber}` : "Invoice Number"}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-[#1e293b]">{details.companyName || "Your Company Name"}</h2>
          </div>
        </div>

        <div className="flex justify-between mb-10">
          <div>
            <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">Billed To</h3>
            <p className="text-lg font-medium text-[#1e293b]">{details.clientName || "Client Name"}</p>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">Date</h3>
            <p className="text-lg font-medium text-[#1e293b]">
              {details.date ? format(new Date(details.date), "MMM dd, yyyy") : "Select Date"}
            </p>
          </div>
        </div>

        <div className="mb-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#1e293b] text-[#1e293b] text-sm font-bold uppercase tracking-wider">
                <th className="py-3 px-2 w-[55%]">Description</th>
                <th className="py-3 px-2 text-center w-[15%]">Qty</th>
                <th className="py-3 px-2 text-right w-[15%]">Price</th>
                <th className="py-3 px-2 text-right w-[15%]">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 px-2 text-center text-[#94a3b8] italic">No items added yet.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-[#e2e8f0] text-[#334155]">
                    <td className="py-4 px-2 font-medium">{item.description || "Description"}</td>
                    <td className="py-4 px-2 text-center">{item.quantity}</td>
                    <td className="py-4 px-2 text-right">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-4 px-2 text-right font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-12">
          <div className="w-1/2">
            <div className="flex justify-between py-2 border-b border-[#e2e8f0]">
              <span className="text-[#64748b] font-medium">Subtotal</span>
              <span className="text-[#1e293b] font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#e2e8f0]">
              <span className="text-[#64748b] font-medium">Tax ({details.taxPercentage}%)</span>
              <span className="text-[#1e293b] font-medium">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-4">
              <span className="text-[#1e293b] font-bold text-xl">Grand Total</span>
              <span className="text-[#1e293b] font-bold text-xl">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">Notes</h3>
          <p className="text-[#475569] text-sm">{details.notes || "Thank you for your business."}</p>
        </div>
      </div>
    );
  }
);

PrintableView.displayName = "PrintableView";
