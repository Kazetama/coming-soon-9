export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceDetails {
  companyName: string;
  clientName: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  taxPercentage: number;
  notes: string;
}
