import React from 'react';
import { cn } from '../../lib/utils';
import Card from '../ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  change,
  className,
}) => {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
          
          {change && (
            <div className="mt-1 flex items-center">
              <span className={cn(
                'text-sm font-medium',
                change.isPositive ? 'text-success-600' : 'text-error-600'
              )}>
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
              <svg
                className={cn(
                  'ml-1 h-4 w-4',
                  change.isPositive ? 'text-success-500' : 'text-error-500'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {change.isPositive ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                )}
              </svg>
              <span className="ml-1 text-xs text-gray-500">from last period</span>
            </div>
          )}
          
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        
        {icon && (
          <div className="p-3 rounded-full bg-primary-100 text-primary-600">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;