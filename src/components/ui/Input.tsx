import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    label,
    error,
    helperText,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    ...props
  }, ref) => {
    const id = props.id || React.useId();
    
    return (
      <div className={cn('flex flex-col', fullWidth ? 'w-full' : '', className)}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        
        <div className={cn('relative', fullWidth ? 'w-full' : '')}>
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              {icon}
            </div>
          )}
          
          <input
            id={id}
            ref={ref}
            className={cn(
              'py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              'placeholder:text-gray-400',
              error ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : '',
              icon && iconPosition === 'left' ? 'pl-10' : '',
              icon && iconPosition === 'right' ? 'pr-10' : '',
              fullWidth ? 'w-full' : '',
              props.disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
            )}
            {...props}
          />
          
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              {icon}
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <p className={cn(
            'mt-1 text-sm',
            error ? 'text-error-500' : 'text-gray-500'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;