import React from 'react';
import { FileSpreadsheet, BarChart, Users, Clock } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { useExcelStore } from '../store/excelStore';
import { formatBytes, formatDate } from '../lib/utils';
import { Bar, Pie } from 'react-chartjs-2';

const Dashboard: React.FC = () => {
  const { files, charts } = useExcelStore();
  
  const recentFiles = files.slice(0, 5);
  const recentCharts = charts.slice(0, 2);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your Excel analytics and recent activities
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Files"
          value={files.length}
          change={{ value: 12, isPositive: true }}
          icon={<FileSpreadsheet size={24} />}
        />
        <StatsCard
          title="Charts Created"
          value={charts.length}
          change={{ value: 8, isPositive: true }}
          icon={<BarChart size={24} />}
        />
        <StatsCard
          title="Active Users"
          value="14"
          change={{ value: 3, isPositive: true }}
          icon={<Users size={24} />}
        />
        <StatsCard
          title="Average Analysis Time"
          value="3m 24s"
          change={{ value: 5, isPositive: false }}
          icon={<Clock size={24} />}
        />
      </div>
      
      {/* Recent Files */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Files</CardTitle>
            <CardDescription>Your recently uploaded Excel files</CardDescription>
          </div>
          <Link to="/files">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentFiles.length === 0 ? (
            <div className="text-center py-8">
              <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No files yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload an Excel file to get started with your analytics.
              </p>
              <div className="mt-6">
                <Link to="/files">
                  <Button>Upload a File</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 -mx-5">
              {recentFiles.map((file) => (
                <Link
                  key={file.id}
                  to={`/files/${file.id}`}
                  className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-md bg-primary-50 text-primary-700">
                      <FileSpreadsheet size={20} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatBytes(file.size)} • {formatDate(file.uploadedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {file.sheetNames.length} sheets
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recentCharts.length > 0 ? (
          recentCharts.map((chart, index) => (
            <Card key={chart.id}>
              <CardHeader>
                <CardTitle>{chart.title}</CardTitle>
                <CardDescription>
                  Created from your Excel data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {chart.type === 'bar' ? (
                    <Bar 
                      data={{
                        labels: chart.labels,
                        datasets: chart.datasets
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        ...chart.options
                      }}
                    />
                  ) : (
                    <Pie
                      data={{
                        labels: chart.labels,
                        datasets: chart.datasets
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        ...chart.options
                      }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your Analytics</CardTitle>
              <CardDescription>
                Create charts and visualizations from your Excel data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No charts yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload an Excel file and create charts to visualize your data.
                </p>
                <div className="mt-6">
                  <Link to="/analytics">
                    <Button>Create Charts</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/files" className="w-full">
              <Button variant="outline" fullWidth icon={<FileSpreadsheet size={18} />}>
                Upload New File
              </Button>
            </Link>
            <Link to="/analytics" className="w-full">
              <Button variant="outline" fullWidth icon={<BarChart size={18} />}>
                Create Charts
              </Button>
            </Link>
            <Link to="/files" className="w-full">
              <Button variant="outline" fullWidth icon={<Clock size={18} />}>
                View Recent Files
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;