import React from "react";
import { format } from "date-fns";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { InvoiceDetails, InvoiceItem } from "@/types/invoice";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#334155",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  invoiceNo: {
    color: "#64748b",
  },
  companyName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  infoCol: {
    flexDirection: "column",
  },
  infoTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 14,
    color: "#1e293b",
  },
  table: {
    width: "100%",
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#1e293b",
    paddingBottom: 8,
    marginBottom: 8,
  },
  colDesc: { width: "55%" },
  colQty: { width: "15%", textAlign: "center" },
  colPrice: { width: "15%", textAlign: "right" },
  colTotal: { width: "15%", textAlign: "right" },
  tableColHeader: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 10,
  },
  tableCellDesc: { width: "55%", color: "#334155" },
  tableCellQty: { width: "15%", textAlign: "center", color: "#334155" },
  tableCellPrice: { width: "15%", textAlign: "right", color: "#334155" },
  tableCellTotal: { width: "15%", textAlign: "right", color: "#334155" },
  emptyRow: {
    paddingVertical: 10,
    color: "#94a3b8",
    fontStyle: "italic",
    textAlign: "center",
  },
  summarySection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 40,
  },
  summaryWrapper: {
    width: "50%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  summaryLabel: { color: "#64748b" },
  summaryValue: { color: "#1e293b" },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginTop: 5,
  },
  grandTotalLabel: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#1e293b" },
  grandTotalValue: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#1e293b" },
  notesSection: {
    marginTop: "auto",
  },
  notesTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  notesContent: {
    color: "#475569",
    fontSize: 10,
  },
});

interface InvoicePDFProps {
  details: InvoiceDetails;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
}

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(amount);
};

export const InvoicePDF: React.FC<InvoicePDFProps> = ({
  details,
  items,
  subtotal,
  taxAmount,
  grandTotal,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.invoiceNo}>
            {details.invoiceNumber ? `#${details.invoiceNumber}` : "Invoice Number"}
          </Text>
        </View>
        <View>
          <Text style={styles.companyName}>{details.companyName || "Your Company Name"}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoCol}>
          <Text style={styles.infoTitle}>Billed To</Text>
          <Text style={styles.infoValue}>{details.clientName || "Client Name"}</Text>
        </View>
        <View style={{ ...styles.infoCol, alignItems: "flex-end" }}>
          <Text style={styles.infoTitle}>Date</Text>
          <Text style={styles.infoValue}>
            {details.date ? format(new Date(details.date), "MMM dd, yyyy") : "Select Date"}
          </Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <View style={styles.colDesc}>
            <Text style={styles.tableColHeader}>Description</Text>
          </View>
          <View style={styles.colQty}>
            <Text style={styles.tableColHeader}>Qty</Text>
          </View>
          <View style={styles.colPrice}>
            <Text style={styles.tableColHeader}>Price</Text>
          </View>
          <View style={styles.colTotal}>
            <Text style={styles.tableColHeader}>Total</Text>
          </View>
        </View>
        
        {items.length === 0 ? (
          <Text style={styles.emptyRow}>No items added yet.</Text>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <View style={styles.colDesc}>
                <Text style={styles.tableCellDesc}>{item.description || "Description"}</Text>
              </View>
              <View style={styles.colQty}>
                <Text style={styles.tableCellQty}>{item.quantity}</Text>
              </View>
              <View style={styles.colPrice}>
                <Text style={styles.tableCellPrice}>{formatCurrency(item.unitPrice, details.currency)}</Text>
              </View>
              <View style={styles.colTotal}>
                <Text style={styles.tableCellTotal}>
                  {formatCurrency(item.quantity * item.unitPrice, details.currency)}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.summarySection}>
        <View style={styles.summaryWrapper}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal, details.currency)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax ({details.taxPercentage}%)</Text>
            <Text style={styles.summaryValue}>{formatCurrency(taxAmount, details.currency)}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(grandTotal, details.currency)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.notesSection}>
        <Text style={styles.notesTitle}>Notes</Text>
        <Text style={styles.notesContent}>{details.notes || "Thank you for your business."}</Text>
      </View>
    </Page>
  </Document>
);
