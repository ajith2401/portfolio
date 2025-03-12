
  // src/components/ui/button.jsx
  export function Button({ variant = 'default', size = 'default', className = '', ...props }) {
    const variants = {
      default: 'bg-gray-900 text-white hover:bg-gray-800',
      destructive: 'bg-red-500 text-white hover:bg-red-600',
      outline: 'border border-gray-200 bg-white hover:bg-gray-100',
      ghost: 'hover:bg-gray-100',
    };
  
    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3',
      lg: 'h-11 px-8',
      icon: 'h-10 w-10'
    };
  
    return (
      <button
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
  