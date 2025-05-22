import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle, FileSpreadsheet, Check } from 'lucide-react';
import { cn, formatBytes } from '../../lib/utils';
import Button from '../ui/Button';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  isUploading?: boolean;
  maxFileSize?: number; // in bytes
  className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUpload,
  isUploading = false,
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  className,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    
    // Check file type
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                    file.type === 'application/vnd.ms-excel';
    
    if (!isExcel) {
      setError('Only Excel files are allowed (.xlsx, .xls)');
      return;
    }
    
    // Check file size
    if (file.size > maxFileSize) {
      setError(`File size exceeds the limit of ${formatBytes(maxFileSize)}`);
      return;
    }
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        onFileUpload(file);
      }
    }, 100);
    
  }, [onFileUpload, maxFileSize]);
  
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });
  
  return (
    <div className={cn('w-full', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer',
          isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400',
          isUploading ? 'pointer-events-none opacity-70' : '',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
        )}
      >
        <input {...getInputProps()} disabled={isUploading} />
        
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          {isUploading ? (
            <>
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary-600 animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">Uploading file...</p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{uploadProgress}% complete</p>
              </div>
            </>
          ) : acceptedFiles.length > 0 ? (
            <>
              <div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center">
                <Check className="h-6 w-6 text-success-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">File ready for upload</p>
              <p className="text-xs text-gray-500">
                {acceptedFiles[0].name} ({formatBytes(acceptedFiles[0].size)})
              </p>
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onFileUpload(acceptedFiles[0]);
                }}
                icon={<Upload size={16} />}
                size="sm"
                className="mt-2"
              >
                Upload File
              </Button>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <FileSpreadsheet className="h-6 w-6 text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">
                Drag and drop your Excel file here
              </p>
              <p className="text-xs text-gray-500">
                Or click to browse for files. Only Excel files (.xlsx, .xls) are supported up to {formatBytes(maxFileSize)}.
              </p>
              <Button 
                variant="outline"
                size="sm"
                icon={<Upload size={16} />}
                className="mt-2"
              >
                Select File
              </Button>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-error-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader;