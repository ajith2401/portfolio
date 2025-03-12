
// src/components/ui/alert.jsx
export function Alert({ variant = 'default', className = '', children }) {
    const variants = {
      default: 'bg-blue-50 text-blue-900',
      destructive: 'bg-red-50 text-red-900',
      success: 'bg-green-50 text-green-900'
    };
  
    return (
      <div className={`rounded-lg p-4 ${variants[variant]} ${className}`}>
        {children}
      </div>
    );
  }
  
  export function AlertTitle({ children }) {
    return <h5 className="font-medium mb-1">{children}</h5>;
  }
  
  export function AlertDescription({ children }) {
    return <div className="text-sm">{children}</div>;
  }
  