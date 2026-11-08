import { ResearchItem } from '../types';

/**
 * TwoManMarkets — RFC-4180 Compliant CSV Export Utility
 * 
 * ============================================================================
 * ARCHITECTURE & LINEAGE NOTE:
 * ----------------------------------------------------------------------------
 * Direction / Lineage:
 * "闇 • Nyx [CODE], — 08:38 PM
 * https://shineup-crm-demo.vercel.app/crm/admin
 * previously done project. this is the direction we will go.
 * https://crm-erp-demo.vercel.app/dashboard more on what I stripped down for you here.
 * [ShineUp CRM/ERP - Enterprise Business Management](https://crm-erp-demo.vercel.app/dashboard)
 * Complete CRM and ERP solution for construction, manufacturing, services, and retail businesses. Manage projects, HR, invoices, and more."
 * 
 * Reused Pattern:
 * Adapted from ShineUp CRM's accounting ledger export routine.
 * 
 * Key Fixes & Hardening for TwoManMarkets:
 * 1. RFC-4180 Escaping: Any cell with commas, quotes, or newlines is wrapped in quotes
 *    and internal quotes are doubled (`"` -> `""`).
 * 2. URL Blob vs Data URI: Previously, `encodeURI("data:text/csv...")` was used.
 *    Data URIs break when fields contain `#` (like `#1 Pick` or `#macro-theses`),
 *    because `#` begins the URL fragment identifier and truncates the downloaded CSV.
 *    Using `Blob` + `URL.createObjectURL` completely eliminates URL length limits
 *    and fragment truncation.
 * 3. Exact Filter Fidelity: If the user filters down to 0 matching records, the export
 *    exports the headers only. It never silently ignores the filter to export all rows.
 * ============================================================================
 */

/*
// ============================================================================
// [REUSED FROM SHINEUP ERP - ANALYTICS DATA EXPORT ENGINE]
// In ShineUp CRM, financial audits were exported via:
//
// const SHINEUP_CSV_COLUMNS = ['InvoiceID', 'Client', 'TotalAmount', 'Status', 'Technician'];
// function exportShineUpInvoices(invoices: LegacyInvoice[]) { ... }
//
// Adapted below to export prediction market positions, closing odds, and P&L.
// ============================================================================
*/

function escapeCsvCell(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '""';
  const str = String(value);
  // If string contains comma, quote, newline, or carriage return, escape it
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Generates and triggers instant browser download of an RFC-4180 compliant CSV file.
 * Returns the number of data rows exported for audit logging.
 */
export function exportResearchLedgerToCsv(
  records: ResearchItem[],
  filenamePrefix = 'TwoManMarkets_Performance'
): number {
  const headers = [
    'ID',
    'Market',
    'Category',
    'Platform/Book',
    'Quoted Odds',
    'Calculated Edge',
    'Stake ($)',
    'Status',
    'Net Profit ($)',
    'ROI (%)',
    'Analyst',
    'Date Submitted'
  ];

  const headerRow = headers.map(h => `"${h}"`).join(',');

  const dataRows = records.map(r => {
    const stake = r.status === 'Invested' || r.status === 'Won' || r.status === 'Lost'
      ? r.actualInvested
      : r.suggestedStake;
    const profit = r.netProfit !== undefined ? r.netProfit : 0;
    const roiStr = r.roi !== undefined ? `${r.roi}%` : '0%';

    return [
      escapeCsvCell(r.id),
      escapeCsvCell(r.market),
      escapeCsvCell(r.category),
      escapeCsvCell(r.book),
      escapeCsvCell(r.odds),
      escapeCsvCell(r.edge),
      escapeCsvCell(stake),
      escapeCsvCell(r.status),
      escapeCsvCell(profit),
      escapeCsvCell(roiStr),
      escapeCsvCell(r.author),
      escapeCsvCell(r.date)
    ].join(',');
  });

  const csvContent = [headerRow, ...dataRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().slice(0, 10);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.setAttribute('download', `${filenamePrefix}_${timestamp}.csv`);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  // Free memory
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  return records.length;
}
