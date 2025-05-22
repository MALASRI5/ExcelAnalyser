import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <AlertCircle className="w-16 h-16 text-error-500 mb-6" />
      <h1 className="text-2xl font-bold text-neutral-800 mb-2">Page Not Found</h1>
      <p className="text-neutral-600 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary" className="flex items-center">
          <Home className="h-4 w-4 mr-2" />
          Return Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;