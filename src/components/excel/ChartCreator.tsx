import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut, PolarArea, Radar } from 'react-chartjs-2';
import { SheetData, ChartConfig } from '../../types';
import { generateColors } from '../../lib/utils';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

interface ChartCreatorProps {
  sheetData: SheetData;
  onSaveChart?: (chartConfig: ChartConfig) => void;
}

const ChartCreator: React.FC<ChartCreatorProps> = ({ sheetData, onSaveChart }) => {
  const [chartTitle, setChartTitle] = useState('');
  const [chartType, setChartType] = useState<ChartConfig['type']>('bar');
  const [xAxisColumn, setXAxisColumn] = useState<string>('');
  const [yAxisColumns, setYAxisColumns] = useState<string[]>([]);
  const [previewConfig, setPreviewConfig] = useState<ChartConfig | null>(null);
  const [chartOptions, setChartOptions] = useState<ChartOptions>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '',
      },
    },
  });

  const numericColumns = sheetData.headers.filter(header => {
    const firstRow = sheetData.rows[0];
    return firstRow && !isNaN(Number(firstRow[header]));
  });

  const nonNumericColumns = sheetData.headers.filter(header => {
    const firstRow = sheetData.rows[0];
    return firstRow && isNaN(Number(firstRow[header]));
  });

  useEffect(() => {
    if (sheetData.headers.length > 0) {
      if (nonNumericColumns.length > 0) {
        setXAxisColumn(nonNumericColumns[0]);
      } else {
        setXAxisColumn(sheetData.headers[0]);
      }
      
      if (numericColumns.length > 0) {
        setYAxisColumns([numericColumns[0]]);
      }
    }
  }, [sheetData.headers]);

  useEffect(() => {
    if (!xAxisColumn || yAxisColumns.length === 0) return;
    
    const labels = sheetData.rows.map(row => String(row[xAxisColumn]));
    
    const datasets = yAxisColumns.map((column, index) => {
      const colors = generateColors(yAxisColumns.length);
      return {
        label: column,
        data: sheetData.rows.map(row => Number(row[column])),
        backgroundColor: chartType === 'line' ? colors[index] : colors[index] + '80',
        borderColor: colors[index],
      };
    });
    
    const newOptions = {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: {
          ...chartOptions.plugins?.title,
          text: chartTitle,
          display: Boolean(chartTitle),
        }
      }
    };
    
    setChartOptions(newOptions);
    
    setPreviewConfig({
      id: Date.now().toString(),
      title: chartTitle,
      type: chartType,
      labels,
      datasets,
      options: newOptions,
    });
  }, [chartTitle, chartType, xAxisColumn, yAxisColumns, sheetData]);

  const handleYAxisColumnChange = (column: string) => {
    if (yAxisColumns.includes(column)) {
      setYAxisColumns(prev => prev.filter(col => col !== column));
    } else {
      setYAxisColumns(prev => [...prev, column]);
    }
  };

  const handleSaveChart = () => {
    if (previewConfig && onSaveChart) {
      onSaveChart(previewConfig);
      setChartTitle('');
    }
  };

  const renderChart = () => {
    if (!previewConfig) return null;
    
    const { type, labels, datasets, options } = previewConfig;
    const chartData = { labels, datasets };
    
    switch (type) {
      case 'bar':
        return <Bar data={chartData} options={options as any} />;
      case 'line':
        return <Line data={chartData} options={options as any} />;
      case 'pie':
        return <Pie data={chartData} options={options as any} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={options as any} />;
      case 'polarArea':
        return <PolarArea data={chartData} options={options as any} />;
      case 'radar':
        return <Radar data={chartData} options={options as any} />;
      default:
        return <Bar data={chartData} options={options as any} />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Chart Settings</CardTitle>
          <CardDescription>Configure your chart parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              label="Chart Title"
              placeholder="Enter chart title"
              value={chartTitle}
              onChange={e => setChartTitle(e.target.value)}
              fullWidth
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Chart Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea'] as const).map(type => (
                <Button
                  key={type}
                  type="button"
                  variant={chartType === type ? 'primary' : 'outline'}
                  size="sm"
                  className="capitalize"
                  onClick={() => setChartType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              X-Axis (Labels)
            </label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={xAxisColumn}
              onChange={e => setXAxisColumn(e.target.value)}
            >
              {sheetData.headers.map(header => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Y-Axis (Values)
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
              {numericColumns.length === 0 ? (
                <p className="text-sm text-gray-500">No numeric columns found</p>
              ) : (
                numericColumns.map(column => (
                  <div key={column} className="flex items-center py-1">
                    <input
                      type="checkbox"
                      id={`column-${column}`}
                      checked={yAxisColumns.includes(column)}
                      onChange={() => handleYAxisColumnChange(column)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`column-${column}`} className="ml-2 text-sm text-gray-700">
                      {column}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <Button 
            onClick={handleSaveChart}
            disabled={!previewConfig || !chartTitle || yAxisColumns.length === 0}
            fullWidth
          >
            Save Chart
          </Button>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Chart Preview</CardTitle>
          <CardDescription>
            {previewConfig ? 'Live preview of your chart' : 'Configure chart settings to see a preview'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {previewConfig ? (
            <div className="h-[400px] w-full">
              {renderChart()}
            </div>
          ) : (
            <div className="h-[400px] w-full flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">Select chart parameters to generate a preview</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartCreator;