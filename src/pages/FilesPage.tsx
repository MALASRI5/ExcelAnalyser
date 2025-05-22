import React, { useState } from 'react';
import { FileSpreadsheet, Trash2, Search, Eye } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import FileUploader from '../components/excel/FileUploader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useExcelStore } from '../store/excelStore';
import { formatBytes, formatDate } from '../lib/utils';
import { Link } from 'react-router-dom';

const FilesPage: React.FC = () => {
  const { files, uploadFile, isLoading } = useExcelStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleFileUpload = (file: File) => {
    uploadFile(file);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Excel Files</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload, manage, and analyze your Excel files
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Upload Excel File</CardTitle>
            <CardDescription>
              Supported formats: .xlsx, .xls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader 
              onFileUpload={handleFileUpload}
              isUploading={isLoading}
            />
          </CardContent>
        </Card>
        
        {/* Files List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Your Files</CardTitle>
                <CardDescription>
                  {files.length} {files.length === 1 ? 'file' : 'files'} uploaded
                </CardDescription>
              </div>
              <Input
                placeholder="Search files..."
                icon={<Search size={16} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredFiles.length === 0 ? (
              <div className="text-center py-8">
                {files.length === 0 ? (
                  <>
                    <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No files uploaded</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Upload an Excel file to get started with your analytics.
                    </p>
                  </>
                ) : (
                  <>
                    <Search className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No files found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try a different search term.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          File
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Uploaded
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sheets
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredFiles.map((file) => (
                        <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 p-2 bg-primary-50 rounded-md">
                                <FileSpreadsheet className="h-5 w-5 text-primary-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {file.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatBytes(file.size)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(file.uploadedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {file.sheetNames.length}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Link to={`/files/${file.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  icon={<Eye size={16} />}
                                  aria-label="View"
                                />
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<Trash2 size={16} />}
                                aria-label="Delete"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FilesPage;