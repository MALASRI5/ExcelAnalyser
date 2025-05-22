import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as XLSX from 'xlsx';
import { SheetData, AnalyticsResult, FilterConfig, SortConfig } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function parseExcelFile(file: File): Promise<SheetData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const sheets: SheetData[] = workbook.SheetNames.map(name => {
          const sheet = workbook.Sheets[name];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          
          if (jsonData.length === 0) {
            return {
              name,
              headers: [],
              rows: [],
              rowCount: 0,
              columnCount: 0
            };
          }
          
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1).map(row => {
            const rowObj: Record<string, any> = {};
            (row as any[]).forEach((cell, index) => {
              if (headers[index]) {
                rowObj[headers[index]] = cell;
              }
            });
            return rowObj;
          });
          
          return {
            name,
            headers,
            rows,
            rowCount: rows.length,
            columnCount: headers.length
          };
        });
        
        resolve(sheets);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

export function analyzeData(sheetData: SheetData): AnalyticsResult {
  const { headers, rows } = sheetData;
  
  // Determine column types
  const numericColumns: string[] = [];
  const textColumns: string[] = [];
  const dateColumns: string[] = [];
  
  headers.forEach(header => {
    let isNumeric = true;
    let isDate = true;
    
    for (const row of rows) {
      const value = row[header];
      
      if (value === undefined || value === null) continue;
      
      if (isNumeric && (isNaN(Number(value)) || value === '')) {
        isNumeric = false;
      }
      
      if (isDate && isNaN(Date.parse(value))) {
        isDate = false;
      }
      
      if (!isNumeric && !isDate) break;
    }
    
    if (isNumeric) {
      numericColumns.push(header);
    } else if (isDate) {
      dateColumns.push(header);
    } else {
      textColumns.push(header);
    }
  });
  
  // Calculate statistics for each column
  const statistics: Record<string, any> = {};
  
  headers.forEach(header => {
    const values = rows.map(row => row[header]).filter(val => val !== undefined && val !== null);
    
    if (numericColumns.includes(header)) {
      const numericValues = values.map(Number);
      const sum = numericValues.reduce((acc, val) => acc + val, 0);
      const mean = sum / numericValues.length;
      const sortedValues = [...numericValues].sort((a, b) => a - b);
      const median = sortedValues.length % 2 === 0 
        ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2 
        : sortedValues[Math.floor(sortedValues.length / 2)];
      const variance = numericValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numericValues.length;
      const stdDev = Math.sqrt(variance);
      
      statistics[header] = {
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        mean,
        median,
        sum,
        variance,
        stdDev,
        uniqueValues: new Set(numericValues).size
      };
    } else {
      // For non-numeric columns, just count unique values
      statistics[header] = {
        uniqueValues: new Set(values).size,
        mode: findMode(values)
      };
    }
  });
  
  return {
    summary: {
      rowCount: rows.length,
      columnCount: headers.length,
      numericColumns,
      textColumns,
      dateColumns
    },
    statistics
  };
}

function findMode(values: any[]): any {
  const counts = values.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  let mode: any = null;
  let maxCount = 0;
  
  for (const [value, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      mode = value;
    }
  }
  
  return mode;
}

export function filterData(data: Record<string, any>[], filters: FilterConfig[]): Record<string, any>[] {
  if (!filters.length) return data;
  
  return data.filter(row => {
    return filters.every(filter => {
      const { column, operator, value, secondValue } = filter;
      const cellValue = row[column];
      
      if (cellValue === undefined || cellValue === null) return false;
      
      switch (operator) {
        case 'equals':
          return cellValue == value;
        case 'contains':
          return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
        case 'greater':
          return Number(cellValue) > Number(value);
        case 'less':
          return Number(cellValue) < Number(value);
        case 'between':
          return Number(cellValue) >= Number(value) && Number(cellValue) <= Number(secondValue);
        case 'in':
          return Array.isArray(value) && value.includes(cellValue);
        default:
          return true;
      }
    });
  });
}

export function sortData(data: Record<string, any>[], sortConfig: SortConfig | null): Record<string, any>[] {
  if (!sortConfig) return data;
  
  const { column, direction } = sortConfig;
  
  return [...data].sort((a, b) => {
    const aValue = a[column];
    const bValue = b[column];
    
    if (aValue === bValue) return 0;
    
    const comparison = aValue < bValue ? -1 : 1;
    return direction === 'asc' ? comparison : -comparison;
  });
}

export function debounce<T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function(...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function downloadExcelFile(sheetData: SheetData, filename: string): void {
  const worksheet = XLSX.utils.json_to_sheet(sheetData.rows, { header: sheetData.headers });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetData.name);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function generateColors(count: number): string[] {
  const baseColors = [
    '#3b82f6', // primary-500
    '#14b8a6', // secondary-500
    '#f59e0b', // accent-500
    '#ef4444', // error-500
    '#22c55e', // success-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#0ea5e9', // sky-500
    '#10b981', // emerald-500
    '#f97316', // warning-500
  ];
  
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  // If we need more colors, generate them with slight variations
  const colors = [...baseColors];
  
  while (colors.length < count) {
    const baseColor = baseColors[colors.length % baseColors.length];
    const hueShift = (colors.length / baseColors.length) * 30;
    colors.push(shiftHue(baseColor, hueShift));
  }
  
  return colors;
}

function shiftHue(hexColor: string, degrees: number): string {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Convert RGB to HSL
  const [h, s, l] = rgbToHsl(r, g, b);
  
  // Shift hue and convert back to RGB
  const newHue = (h + degrees) % 360;
  const [newR, newG, newB] = hslToRgb(newHue, s, l);
  
  // Convert RGB back to hex
  return `#${(1 << 24 | newR << 16 | newG << 8 | newB).toString(16).slice(1)}`;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h *= 60;
  }
  
  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, (h / 360) + 1/3);
    g = hue2rgb(p, q, h / 360);
    b = hue2rgb(p, q, (h / 360) - 1/3);
  }
  
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}