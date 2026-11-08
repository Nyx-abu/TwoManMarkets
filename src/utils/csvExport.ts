import { ResearchItem } from '../types';

// CSV export helper for tabular data

// TODO: remove legacy invoice exporter columns
// const OLD_CSV_COLUMNS = ['InvoiceID', 'Client', 'TotalAmount', 'Status'];

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
