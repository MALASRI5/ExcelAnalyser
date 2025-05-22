export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface ExcelFile {
  id: string;
  name: string;
  uploadedBy: string;
  uploadedAt: string;
  size: number;
  lastModified: string;
  sheetNames: string[];
}

export interface SheetData {
  name: string;
  headers: string[];
  rows: Record<string, any>[];
  rowCount: number;
  columnCount: number;
}

export interface ChartConfig {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'scatter' | 'bubble';
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
  options?: Record<string, any>;
}

export interface Dashboard {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  lastModified: string;
  isPublic: boolean;
  charts: ChartConfig[];
  layout?: Record<string, any>[];
}

export interface AnalyticsResult {
  summary: {
    rowCount: number;
    columnCount: number;
    numericColumns: string[];
    textColumns: string[];
    dateColumns: string[];
  };
  statistics: Record<string, {
    min?: number;
    max?: number;
    mean?: number;
    median?: number;
    mode?: any;
    sum?: number;
    variance?: number;
    stdDev?: number;
    uniqueValues?: number;
  }>;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface FilterConfig {
  column: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between' | 'in';
  value: any;
  secondValue?: any; // For 'between' operator
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}