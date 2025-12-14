import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { Button } from "../../components/ui/Button";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";
import { amountToWords, formatCurrency } from "../../utils/formatters";

const InvoiceView = () => {
  const { id } = useParams();
  const bill = useAppSelector((state) =>
    state.billing.bills.find((b) => b.id === id)
  );
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (!bill) {
    return <div className="p-8 text-center">Bill not found.</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 no-print">
        <h1 className="text-2xl font-bold">Invoice Preview</h1>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Print Invoice
        </Button>
      </div>

      <div
        ref={componentRef}
        className="bg-white text-black p-8 shadow-lg border rounded-sm print:shadow-none print:border-0"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-wide">
              Invoice
            </h1>
            <p className="text-sm font-medium mt-2">
              Invoice #: {bill.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-sm">Date: {bill.date}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold">Cloud Kitchen</h2>
            <p className="text-sm">123 Food Street, Dhaka</p>
            <p className="text-sm">Phone: 01700000000</p>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">
            Bill To:
          </h3>
          <p className="font-bold text-lg">{bill.clientName}</p>
          <p>{bill.contactPerson}</p>
          <p>{bill.contactNumber}</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full mb-8 min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-2 font-bold">Description</th>
                <th className="text-center py-2 font-bold w-24">Qty/Pers</th>
                <th className="text-right py-2 font-bold w-32">Unit Price</th>
                <th className="text-right py-2 font-bold w-32">Total</th>
              </tr>
            </thead>
            <tbody>
              {bill.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2">
                    {item.description}
                    {item.packageType && (
                      <span className="text-xs text-gray-500 ml-2">
                        ({item.packageType})
                      </span>
                    )}
                  </td>
                  <td className="text-center py-2">{item.quantity}</td>
                  <td className="text-right py-2">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="text-right py-2">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-64 space-y-2">
            <div className="flex justify-between font-bold text-xl border-t-2 border-black pt-2">
              <span>Grand Total:</span>
              <span>{formatCurrency(bill.grandTotal)}</span>
            </div>
            <div className="text-right text-sm italic text-gray-600">
              {amountToWords(bill.grandTotal)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-8 text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
          <p className="mt-2">Terms & Conditions Apply</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
