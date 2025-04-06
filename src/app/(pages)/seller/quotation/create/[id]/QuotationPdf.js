'use client';

import React, { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink, Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import Button from "@/app/components/ui/Buttons/Button";
import { IoDownloadOutline } from "react-icons/io5";
import { styles } from '../../style';

// Create a local currency formatter function that works with PDF
const formatVND = (value) => {
  // First ensure the value is a valid number
  console.log("Formatting raw value:", value, "type:", typeof value);
  
  // Special handling for formatted strings with dots or commas
  let numValue;
  if (typeof value === 'string') {
    // Remove all dots and commas, then parse
    const cleanStr = value.replace(/[.,\s]/g, '');
    numValue = parseFloat(cleanStr);
    console.log("Cleaned string:", cleanStr, "parsed as:", numValue);
  } else if (typeof value === 'number') {
    numValue = value;
  } else {
    numValue = 0;
  }
  
  // Handle non-numeric or NaN values
  if (isNaN(numValue)) numValue = 0;
  
  console.log("Final formatted value:", numValue);
  
  // Format as Vietnamese Dong with space before VND
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(numValue) + ' VND';
};

// Helper function to parse potentially formatted number strings
const parseFormattedNumber = (value) => {
  if (typeof value === 'number') return value;
  if (!value && value !== 0 && value !== '0') return 0;
  
  // First convert to string and log value type and content
  const stringValue = value.toString();
  console.log(`PDF parsing value: "${stringValue}" (${typeof value})`);
  
  // Special case for Input formatPrice values
  // If the value is numeric digits only, we need to use it directly
  if (/^\d+$/.test(stringValue)) {
    const numericValue = parseInt(stringValue, 10);
    console.log(`Direct numeric value: ${numericValue}`);
    return numericValue;
  }
  
  // Handle numbers that might be formatted with dots as thousand separators (Vietnamese format)
  // For example: "1.000.000" → 1000000
  const cleanStr = stringValue.replace(/[.,\s]/g, '');
  const result = parseFloat(cleanStr);
  
  // Log the parsing result
  console.log(`PDF parsed result: ${result}`);
  
  return isNaN(result) ? 0 : result;
};

// Create the PDF Document component
const QuotationDocument = ({ data = {} }) => {
  // Log the incoming data to debug
  console.log("PDF Document received data:", data);
  
  // Safe data extraction with defaults
  const {
    quotationCode = 'N/A',
    customerName = 'N/A',
    customerEmail = 'N/A',
    customerPhone = 'N/A',
    eventDate = 'N/A',
    terms = 'Standard terms apply',
    serviceItems = [],
    materials = [],
    constructionTasks = [],
    depositPercentage = 30
  } = data;

  // Ensure materials and constructionTasks are arrays
  const safetyMaterials = Array.isArray(materials) ? materials : [];
  const safetyTasks = Array.isArray(constructionTasks) ? constructionTasks : [];

  // Calculate total for materials
  const materialTotal = safetyMaterials.reduce((sum, item) => {
    // Parse cost and quantity, handling formatted strings
    const cost = parseFormattedNumber(item.cost);
    const quantity = parseFormattedNumber(item.quantity) || 1;
    
    console.log(`Material ${item.materialName}: raw cost=${item.cost}, parsed cost=${cost}, qty=${quantity}, total=${cost * quantity}`);
    
    return sum + (cost * quantity);
  }, 0);

  // Calculate total for construction tasks
  const constructionTotal = safetyTasks.reduce((sum, item) => {
    // Parse cost, handling formatted strings
    const cost = parseFormattedNumber(item.cost);
    
    console.log(`Task ${item.taskName}: raw cost=${item.cost}, parsed cost=${cost}`);
    
    return sum + cost;
  }, 0);

  // Calculate grand total
  const grandTotal = materialTotal + constructionTotal;
  
  // Log the calculated totals
  console.log("PDF Calculated totals:", { materialTotal, constructionTotal, grandTotal });
  
  // Calculate deposit amount - ensure depositPercentage is a number
  const depositPercent = parseFloat(depositPercentage || 30);
  const depositAmount = grandTotal * (depositPercent / 100);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>#{quotationCode}</Text>
          <Text style={styles.subtitle}>Created: {new Date().toLocaleDateString()}</Text>
        </View>

        {/* Client Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <Text style={styles.text}>Name: {customerName}</Text>
          <Text style={styles.text}>Email: {customerEmail}</Text>
        </View>

        {/* Service Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quotation Details</Text>
          
          {/* Materials Table */}
          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>Materials</Text>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[styles.tableCell, { flex: 3 }]}>
                  <Text>Material Name</Text>
                </View>
                <View style={[styles.tableCell, { flex: 1 }]}>
                  <Text>Quantity</Text>
                </View>
                <View style={[styles.tableCell, { flex: 1 }]}>
                  <Text>Cost</Text>
                </View>
              </View>
              
              {/* Materials Rows */}
              {safetyMaterials.length > 0 ? (
                safetyMaterials.map((item, index) => {
                  console.log("Rendering material:", item);
                  // Display raw cost for debugging
                  console.log(`Raw cost for ${item.materialName || 'unknown'}:`, item.cost);
                  
                  // Special handling for Input component with formatPrice property
                  let costValue = item.cost;
                  
                  // If the cost is a DOM element event or something unexpected from Input component
                  if (costValue && costValue._reactName) {
                    console.warn(`Got React event instead of value:`, costValue);
                    costValue = 0;
                  }
                  
                  // Parse formatted numbers for display
                  const parsedCost = parseFormattedNumber(costValue);
                  console.log(`Parsed cost:`, parsedCost);
                  
                  return (
                    <View key={`material-${index}`} style={styles.tableRow}>
                      <View style={[styles.tableCell, { flex: 3 }]}>
                        <Text>{item.materialName || 'N/A'}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 1 }]}>
                        <Text>{item.quantity || 0}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 1 }]}>
                        <Text>{formatVND(parsedCost)}</Text>
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={styles.tableRow}>
                  <View style={[styles.tableCell, { flex: 6 }]}>
                    <Text>No materials added</Text>
                  </View>
                </View>
              )}
            </View>
            
            {/* Material Total */}
            <View style={styles.subtotal}>
              <Text style={styles.totalLabel}>Materials Total:</Text>
              <Text style={styles.totalValue}>{formatVND(materialTotal)}</Text>
            </View>
          </View>
          
          {/* Construction Tasks Table */}
          <View style={[styles.tableContainer, { marginTop: 20 }]}>
            <Text style={styles.tableTitle}>Construction Tasks</Text>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[styles.tableCell, { flex: 3 }]}>
                  <Text>Task Name</Text>
                </View>
                <View style={[styles.tableCell, { flex: 1 }]}>
                  <Text>Cost</Text>
                </View>
                <View style={[styles.tableCell, { flex: 1 }]}>
                  <Text>Unit</Text>
                </View>
                <View style={[styles.tableCell, { flex: 0.8 }]}>
                  <Text>Length</Text>
                </View>
                <View style={[styles.tableCell, { flex: 0.8 }]}>
                  <Text>Width</Text>
                </View>
              </View>
              
              {/* Construction Task Rows */}
              {safetyTasks.length > 0 ? (
                safetyTasks.map((item, index) => {
                  console.log("Rendering task:", item);
                  // Display raw cost for debugging
                  console.log(`Raw cost for ${item.taskName || 'unknown'}:`, item.cost);
                  
                  // Special handling for Input component with formatPrice property
                  let costValue = item.cost;
                  
                  // If the cost is a DOM element event or something unexpected from Input component
                  if (costValue && costValue._reactName) {
                    console.warn(`Got React event instead of value:`, costValue);
                    costValue = 0;
                  }
                  
                  // Parse formatted numbers for display
                  const parsedCost = parseFormattedNumber(costValue);
                  console.log(`Parsed cost:`, parsedCost);
                  
                  return (
                    <View key={`task-${index}`} style={styles.tableRow}>
                      <View style={[styles.tableCell, { flex: 3 }]}>
                        <Text>{item.taskName || 'N/A'}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 1 }]}>
                        <Text>{formatVND(parsedCost)}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 1 }]}>
                        <Text>{item.unit || 'N/A'}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 0.8 }]}>
                        <Text>{item.length || 0}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 0.8 }]}>
                        <Text>{item.width || 0}</Text>
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={styles.tableRow}>
                  <View style={[styles.tableCell, { flex: 6.6 }]}>
                    <Text>No construction tasks added</Text>
                  </View>
                </View>
              )}
            </View>
            
            {/* Construction Total */}
            <View style={styles.subtotal}>
              <Text style={styles.totalLabel}>Construction Total:</Text>
              <Text style={styles.totalValue}>{formatVND(constructionTotal)}</Text>
            </View>
          </View>

          {/* Grand Total and Deposit */}
          <View style={styles.total}>
            <Text style={styles.totalLabel}>Grand Total:</Text>
            <Text style={styles.totalValue}>{formatVND(grandTotal)}</Text>
          </View>
          <View style={styles.total}>
            <Text style={styles.totalLabel}>Deposit ({depositPercent}%):</Text>
            <Text style={styles.totalValue}>{formatVND(depositAmount)}</Text>
          </View>
        </View>

        {/* Terms & Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms and Conditions</Text>
          <Text style={styles.text}>{terms || 'Standard terms apply'}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
          <Text>Season Decor - Event Decoration Services</Text>
        </View>
      </Page>
    </Document>
  );
};

// PDF Preview Component
export const PdfPreview = ({ quotationData }) => {
  return (
    <PDFViewer width="100%" height="100%" className="border rounded">
      <QuotationDocument data={quotationData} />
    </PDFViewer>
  );
};

// PDF Download Button Component
export const PdfDownloadButton = ({ quotationData }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <Button
        label="Preparing..."
        icon={<IoDownloadOutline size={20} />}
        className="bg-gray-400"
        disabled
      />
    );
  }
  
  return (
    <PDFDownloadLink
      document={<QuotationDocument data={quotationData} />}
      fileName={`quotation-${quotationData.quotationNumber || 'download'}.pdf`}
    >
      {({ loading, error }) => (
        <Button
          label={loading || error ? "Preparing..." : "Download PDF"}
          icon={<IoDownloadOutline size={20} />}
          className={loading || error ? "bg-gray-400" : "bg-green-600"}
          disabled={loading || error}
        />
      )}
    </PDFDownloadLink>
  );
};

// Add this function to generate PDF blob for API upload
export const generatePdfBlob = async (quotationData) => {
  const pdfDoc = <QuotationDocument data={quotationData} />;
  const blob = await pdf(pdfDoc).toBlob();
  return blob;
};

export default {
  PdfPreview,
  PdfDownloadButton
}; 