import React, { useState } from 'react';
import { BarChart, FileSpreadsheet, ArrowRight, Filter, SortAsc, Download } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import DataTable from '../components/ui/DataTable';
import ChartCreator from '../components/excel/ChartCreator';
import { useExcelStore } from '../store/excelStore';
import { FilterConfig, SortConfig } from '../types';
import { downloadExcelFile } from '../lib/utils';
import { Link } from 'react-router-dom';

const AnalyticsPage: React.FC = () => {
  const { 
    currentFile,
    currentSheet,
    analyticsResults,
    charts,
    filters,
    sortConfig,
    applyFilter,
    clearFilters,
    applySorting,
    clearSorting,
    saveChart,
    getFilteredData
  } = useExcelStore();
  
  const [showChartCreator, setShowChartCreator] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [newFilter, setNewFilter] = useState<Partial<FilterConfig>>({
    column: '',
    operator: 'equals',
    value: ''
  });
  
  const filteredData = getFilteredData();
  
  const handleSaveChart = (chartConfig: any) => {
    saveChart(chartConfig);
    setShowChartCreator(false);
  };
  
  const handleApplyFilter = () => {
    if (newFilter.column && newFilter.operator && newFilter.value !== undefined) {
      applyFilter(newFilter as FilterConfig);
      setNewFilter({
        column: '',
        operator: 'equals',
        value: ''
      });
      setShowFilterModal(false);
    }
  };
  
  const handleApplySorting = (column: string) => {
    if (sortConfig?.column === column) {
      applySorting({
        column,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      applySorting({
        column,
        direction: 'asc'
      });
    }
  };
  
  const handleExportData = () => {
    if (currentSheet) {
      const exportData = {
        ...currentSheet,
        rows: filteredData
      };
      
      downloadExcelFile(exportData, `${currentFile?.name || 'export'}_filtered`);
    }
  };
  
  // Prepare data for the table
  const columns = currentSheet?.headers.map(header => ({
    Header: header,
    accessor: header
  })) || [];
  
  if (!currentFile || !currentSheet) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze and visualize your Excel data
          </p>
        </div>
        
        <Card className="text-center py-12">
          <CardContent>
            <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No file selected</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Upload an Excel file to start analyzing and visualizing your data.
            </p>
            <div className="mt-6">
              <Link to="/files">
                <Button>Upload Excel File</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyzing {currentFile.name} - {currentSheet.name}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            icon={<Download size={16} />}
            onClick={handleExportData}
          >
            Export
          </Button>
          <Button
            variant="outline"
            icon={<Filter size={16} />}
            onClick={() => setShowFilterModal(true)}
          >
            Filter
          </Button>
          <Button
            onClick={() => setShowChartCreator(true)}
            icon={<BarChart size={16} />}
          >
            Create Chart
          </Button>
        </div>
      </div>
      
      {/* Analytics Summary */}
      {analyticsResults && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between py-1 border-b">
                <span className="text-sm text-gray-500">Rows:</span>
                <span className="text-sm font-medium">{analyticsResults.summary.rowCount}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-sm text-gray-500">Columns:</span>
                <span className="text-sm font-medium">{analyticsResults.summary.columnCount}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-sm text-gray-500">Numeric Columns:</span>
                <span className="text-sm font-medium">{analyticsResults.summary.numericColumns.length}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-sm text-gray-500">Text Columns:</span>
                <span className="text-sm font-medium">{analyticsResults.summary.textColumns.length}</span>
              </div>
            </CardContent>
          </Card>
          
          {analyticsResults.summary.numericColumns.slice(0, 2).map(column => (
            <Card key={column}>
              <CardHeader>
                <CardTitle>{column}</CardTitle>
                <CardDescription>Numeric column statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-sm text-gray-500">Min:</span>
                  <span className="text-sm font-medium">
                    {analyticsResults.statistics[column].min?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-sm text-gray-500">Max:</span>
                  <span className="text-sm font-medium">
                    {analyticsResults.statistics[column].max?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-sm text-gray-500">Mean:</span>
                  <span className="text-sm font-medium">
                    {analyticsResults.statistics[column].mean?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-sm text-gray-500">Unique Values:</span>
                  <span className="text-sm font-medium">
                    {analyticsResults.statistics[column].uniqueValues}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Show Chart Creator if requested */}
      {showChartCreator && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Create Chart</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowChartCreator(false)}
              >
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChartCreator 
              sheetData={currentSheet} 
              onSaveChart={handleSaveChart} 
            />
          </CardContent>
        </Card>
      )}
      
      {/* Active Filters */}
      {filters.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Active Filters</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                  <span className="text-sm font-medium">
                    {filter.column} {filter.operator} {filter.value}
                  </span>
                  <button 
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={() => useExcelStore.getState().removeFilter(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Data Preview</CardTitle>
              <CardDescription>
                Showing {filteredData.length} of {currentSheet.rows.length} rows
              </CardDescription>
            </div>
            {sortConfig && (
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">
                  Sorted by: {sortConfig.column} ({sortConfig.direction})
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearSorting}
                  className="p-1 h-auto"
                >
                  &times;
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredData}
            columns={columns}
            pagination={true}
            filtering={true}
          />
        </CardContent>
      </Card>
      
      {/* Charts */}
      {charts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Charts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {charts.map((chart) => (
              <Card key={chart.id}>
                <CardHeader>
                  <CardTitle>{chart.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {/* This would render different chart types based on the chart config */}
                    {chart.type === 'bar' && (
                      <BarChart className="h-full w-full text-gray-400" />
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => useExcelStore.getState().deleteChart(chart.id)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add Filter</CardTitle>
              <CardDescription>Filter your data based on conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Column
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={newFilter.column}
                  onChange={(e) => setNewFilter({...newFilter, column: e.target.value})}
                >
                  <option value="">Select a column</option>
                  {currentSheet.headers.map(header => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operator
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={newFilter.operator}
                  onChange={(e) => setNewFilter({...newFilter, operator: e.target.value as any})}
                >
                  <option value="equals">Equals</option>
                  <option value="contains">Contains</option>
                  <option value="greater">Greater Than</option>
                  <option value="less">Less Than</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={newFilter.value as string || ''}
                  onChange={(e) => setNewFilter({...newFilter, value: e.target.value})}
                  placeholder="Enter filter value"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowFilterModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleApplyFilter}>
                Apply Filter
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;