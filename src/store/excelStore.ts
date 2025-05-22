import { create } from 'zustand';
import { ExcelFile, SheetData, AnalyticsResult, FilterConfig, SortConfig, ChartConfig } from '../types';
import { parseExcelFile, analyzeData, filterData, sortData } from '../lib/utils';

interface ExcelState {
  files: ExcelFile[];
  currentFile: ExcelFile | null;
  sheets: SheetData[];
  currentSheet: SheetData | null;
  analyticsResults: AnalyticsResult | null;
  isLoading: boolean;
  error: string | null;
  filters: FilterConfig[];
  sortConfig: SortConfig | null;
  charts: ChartConfig[];
  
  uploadFile: (file: File) => Promise<void>;
  selectFile: (fileId: string) => void;
  selectSheet: (sheetName: string) => void;
  applyFilter: (filter: FilterConfig) => void;
  removeFilter: (index: number) => void;
  clearFilters: () => void;
  applySorting: (sortConfig: SortConfig) => void;
  clearSorting: () => void;
  saveChart: (chart: ChartConfig) => void;
  deleteChart: (chartId: string) => void;
  getFilteredData: () => Record<string, any>[];
}

export const useExcelStore = create<ExcelState>((set, get) => ({
  files: [],
  currentFile: null,
  sheets: [],
  currentSheet: null,
  analyticsResults: null,
  isLoading: false,
  error: null,
  filters: [],
  sortConfig: null,
  charts: [],
  
  uploadFile: async (file: File) => {
    set({ isLoading: true, error: null });
    
    try {
      const sheets = await parseExcelFile(file);
      
      const fileId = Date.now().toString();
      const newFile: ExcelFile = {
        id: fileId,
        name: file.name,
        uploadedBy: 'current-user', // Would come from auth in a real app
        uploadedAt: new Date().toISOString(),
        size: file.size,
        lastModified: new Date(file.lastModified).toISOString(),
        sheetNames: sheets.map(sheet => sheet.name),
      };
      
      set(state => ({
        files: [...state.files, newFile],
        currentFile: newFile,
        sheets,
        currentSheet: sheets[0],
        analyticsResults: analyzeData(sheets[0]),
        isLoading: false,
        filters: [],
        sortConfig: null,
      }));
    } catch (error) {
      set({
        error: 'Failed to parse Excel file',
        isLoading: false,
      });
    }
  },
  
  selectFile: (fileId: string) => {
    const file = get().files.find(f => f.id === fileId);
    
    if (file) {
      set({ currentFile: file });
    }
  },
  
  selectSheet: (sheetName: string) => {
    const sheet = get().sheets.find(s => s.name === sheetName);
    
    if (sheet) {
      set({
        currentSheet: sheet,
        analyticsResults: analyzeData(sheet),
        filters: [],
        sortConfig: null,
      });
    }
  },
  
  applyFilter: (filter: FilterConfig) => {
    set(state => ({
      filters: [...state.filters, filter],
    }));
  },
  
  removeFilter: (index: number) => {
    set(state => ({
      filters: state.filters.filter((_, i) => i !== index),
    }));
  },
  
  clearFilters: () => {
    set({ filters: [] });
  },
  
  applySorting: (sortConfig: SortConfig) => {
    set({ sortConfig });
  },
  
  clearSorting: () => {
    set({ sortConfig: null });
  },
  
  saveChart: (chart: ChartConfig) => {
    set(state => ({
      charts: [...state.charts, chart],
    }));
  },
  
  deleteChart: (chartId: string) => {
    set(state => ({
      charts: state.charts.filter(chart => chart.id !== chartId),
    }));
  },
  
  getFilteredData: () => {
    const { currentSheet, filters, sortConfig } = get();
    
    if (!currentSheet) {
      return [];
    }
    
    let processedData = [...currentSheet.rows];
    
    if (filters.length > 0) {
      processedData = filterData(processedData, filters);
    }
    
    if (sortConfig) {
      processedData = sortData(processedData, sortConfig);
    }
    
    return processedData;
  },
}));