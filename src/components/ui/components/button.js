// src/components/ui/button.js
import React from 'react';

const Button = ({ 
  children, 
  variant = 'default',
  size = 'default',
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-primary text-white hover:bg-primary/90',
    outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  };

  const sizes = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 px-3 text-sm',
    lg: 'h-10 px-8',
    icon: 'h-9 w-9',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// src/components/ui/input.js
const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

// src/components/ui/dialog.js
const Dialog = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// src/components/ui/select.js
const Select = ({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select an option',
  className = '' 
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

// src/components/ui/alert.js
const Alert = ({ 
  title, 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const variants = {
    default: 'bg-background text-foreground',
    destructive: 'bg-destructive/15 text-destructive dark:bg-destructive dark:text-destructive-foreground',
    success: 'bg-green-100 text-green-800',
  };

  return (
    <div className={`rounded-lg border p-4 ${variants[variant]} ${className}`}>
      {title && <h5 className="font-medium mb-1">{title}</h5>}
      <div className="text-sm">{children}</div>
    </div>
  );
};

export { Button, Input, Dialog, Select, Alert };