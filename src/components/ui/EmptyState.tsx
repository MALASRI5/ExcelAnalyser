import React from 'react';
import { ClipboardList } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = <ClipboardList className="w-16 h-16 text-neutral-300" />,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-medium text-neutral-800 mb-2">{title}</h3>
      <p className="text-neutral-500 mb-6 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;