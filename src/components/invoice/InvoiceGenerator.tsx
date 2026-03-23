"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { Plus, Trash2, Printer, FileText, Download, Loader2 } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

import { InvoiceDetails, InvoiceItem } from "@/types/invoice";
import { PrintableView } from "./PrintableView";
import { InvoicePDF } from "./InvoicePDF";

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(amount);
};

export const InvoiceGenerator = () => {
  const [details, setDetails] = useState<InvoiceDetails>({
    companyName: "",
    clientName: "",
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    taxPercentage: 0,
    currency: "USD",
    notes: "Please send payment within 30 days of receiving this invoice.",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0 }
  ]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef });

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: name === "taxPercentage" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "description" ? value : parseFloat(value as string) || 0,
            }
          : item
      )
    );
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: "",
      quantity: 1,
      unitPrice: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculations
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  }, [items]);

  const taxAmount = useMemo(() => {
    return (subtotal * details.taxPercentage) / 100;
  }, [subtotal, details.taxPercentage]);

  const grandTotal = useMemo(() => {
    return subtotal + taxAmount;
  }, [subtotal, taxAmount]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              Invoice Generator
            </h1>
            <p className="text-slate-500 mt-1">Create, manage, and download professional invoices instantly.</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => handlePrint()} 
              size="lg" 
              className="border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              <Printer className="mr-2 h-5 w-5" /> Print
            </Button>
            
            {isClient ? (
              <PDFDownloadLink
                document={<InvoicePDF details={details} items={items} subtotal={subtotal} taxAmount={taxAmount} grandTotal={grandTotal} />}
                fileName={`Invoice-${details.invoiceNumber || "Draft"}.pdf`}
                className="inline-block"
              >

                {({ loading }) => (
                  <Button 
                    disabled={loading}
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 shadow-md transition-all min-w-[170px]"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-5 w-5" />
                    )}
                    {loading ? "Preparing PDF..." : "Download PDF"}
                  </Button>
                )}
              </PDFDownloadLink>
            ) : (
              <Button disabled size="lg" className="bg-blue-600 min-w-[170px]">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Preparing...
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
                <CardTitle className="text-lg">Invoice Details</CardTitle>
                <CardDescription>Enter the header details for this invoice.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Your Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={details.companyName}
                    onChange={handleDetailsChange}
                    placeholder="Acme Corp"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    name="clientName"
                    value={details.clientName}
                    onChange={handleDetailsChange}
                    placeholder="Globex Inc"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    name="invoiceNumber"
                    value={details.invoiceNumber}
                    onChange={handleDetailsChange}
                    placeholder="INV-2024-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={details.date}
                    onChange={handleDetailsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    name="currency"
                    value={details.currency}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleDetailsChange(e)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="IDR">IDR (Rp)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="SGD">SGD (S$)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Line Items</CardTitle>
                  <CardDescription>Add the products or services provided.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6 p-0 sm:p-6">
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[40%]">Description</TableHead>
                        <TableHead className="w-[20%] text-center">Quantity</TableHead>
                        <TableHead className="w-[20%] text-right">Unit Price</TableHead>
                        <TableHead className="w-[15%] text-right">Total</TableHead>
                        <TableHead className="w-[5%]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id} className="group border-b-slate-100">
                          <TableCell className="p-2 sm:p-4">
                            <Input
                              placeholder="Item description"
                              value={item.description}
                              onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                              className="border-slate-200 focus-visible:ring-blue-500"
                            />
                          </TableCell>
                          <TableCell className="p-2 sm:p-4">
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity || ""}
                              onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)}
                              className="text-center border-slate-200 focus-visible:ring-blue-500"
                            />
                          </TableCell>
                          <TableCell className="p-2 sm:p-4">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice || ""}
                              onChange={(e) => handleItemChange(item.id, "unitPrice", e.target.value)}
                              className="text-right border-slate-200 focus-visible:ring-blue-500"
                            />
                          </TableCell>
                          <TableCell className="p-2 sm:p-4 text-right font-medium text-slate-700">
                            {formatCurrency(item.quantity * item.unitPrice, details.currency)}
                          </TableCell>
                          <TableCell className="p-2 sm:p-4 text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              disabled={items.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 rounded-b-xl">
                <Button onClick={addItem} variant="outline" className="w-full sm:w-auto bg-white hover:bg-slate-100 border-dashed border-slate-300">
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm sticky top-6">
              <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-800">{formatCurrency(subtotal, details.currency)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-slate-600">Tax (%)</span>
                    <Input
                      id="taxPercentage"
                      name="taxPercentage"
                      type="number"
                      min="0"
                      max="100"
                      value={details.taxPercentage || ""}
                      onChange={handleDetailsChange}
                      className="w-24 text-right border-slate-200"
                    />
                  </div>

                  {taxAmount > 0 && (
                    <div className="flex justify-between items-center text-slate-600 text-sm">
                      <span>Tax Amount</span>
                      <span>{formatCurrency(taxAmount, details.currency)}</span>
                    </div>
                  )}
                  
                  <Separator className="bg-slate-200" />
                  
                  <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
                    <span className="font-bold text-slate-800 text-lg">Total</span>
                    <span className="font-bold text-blue-700 text-xl">{formatCurrency(grandTotal, details.currency)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Label htmlFor="notes">Notes / Terms</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={details.notes}
                    onChange={handleDetailsChange}
                    className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter any notes or terms of service..."
                  />
                </div>

                {isClient ? (
                  <PDFDownloadLink
                    document={<InvoicePDF details={details} items={items} subtotal={subtotal} taxAmount={taxAmount} grandTotal={grandTotal} />}
                    fileName={`Invoice-${details.invoiceNumber || "Draft"}.pdf`}
                    className="w-full flex"
                  >
                    {({ loading }) => (
                      <Button 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base shadow-sm hover:shadow transition-all"
                      >
                        {loading ? (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                          <Download className="mr-2 h-5 w-5" />
                        )}
                        {loading ? "Preparing PDF..." : "Download PDF"}
                      </Button>
                    )}
                  </PDFDownloadLink>
                ) : (
                  <Button disabled className="w-full bg-blue-600 h-12 text-base">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading PDF engine...
                  </Button>
                )}
                
                <Button 
                  variant="ghost" 
                  onClick={() => handlePrint()} 
                  className="w-full text-slate-500 hover:text-slate-700 h-10"
                >
                  <Printer className="mr-2 h-4 w-4" /> Open Print Dialog
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div ref={contentRef} style={{ width: '800px', backgroundColor: 'white' }}>
          <PrintableView 
            details={details} 
            items={items} 
            subtotal={subtotal} 
            taxAmount={taxAmount} 
            grandTotal={grandTotal} 
          />
        </div>
      </div>
    </div>
  );
};
