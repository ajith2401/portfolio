
  // src/components/ui/input.jsx
  export function Input({ className = '', ...props }) {
    return (
      <input
        className={`modern-input flex h-10 w-full file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  }
  