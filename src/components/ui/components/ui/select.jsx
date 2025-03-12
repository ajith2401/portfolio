'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// Create context for the Select component
const SelectContext = React.createContext(null);

export const Select = ({ defaultValue, value, onValueChange, children, placeholder }) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || value);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");

  // Update internal state when props change
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);
  
  // Update internal state when defaultValue changes
  useEffect(() => {
    if (defaultValue !== undefined && value === undefined) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue, value]);

  const handleSelect = (val, label) => {
    setSelectedValue(val);
    setSelectedLabel(label);
    onValueChange?.(val);
    setIsOpen(false);
  };

  const contextValue = {
    isOpen,
    setIsOpen,
    selectedValue,
    selectedLabel,
    handleSelect,
    placeholder
  };

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ children, className = '' }) => {
  const { isOpen, setIsOpen } = React.useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={`flex items-center justify-between w-full h-10 px-3 py-2 text-sm bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
    >
      {children}
      <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
    </button>
  );
};

export const SelectContent = ({ children }) => {
  const { isOpen } = React.useContext(SelectContext);

  if (!isOpen) return null;

  return (
    <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
      {children}
    </div>
  );
};

export const SelectValue = ({ placeholder }) => {
  const { selectedValue, selectedLabel, placeholder: contextPlaceholder } = React.useContext(SelectContext);
  
  // Display selectedLabel if we have it, otherwise use the default placeholder
  const displayValue = selectedLabel || (selectedValue ? String(selectedValue) : (placeholder || contextPlaceholder || "Select an option"));
  
  return <span className="truncate">{displayValue}</span>;
};

export const SelectItem = ({ children, value }) => {
  const { selectedValue, handleSelect } = React.useContext(SelectContext);
  const isSelected = value === selectedValue;

  return (
    <button
      type="button"
      className={`flex items-center w-full px-3 py-2 text-sm ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
      onClick={() => handleSelect(value, children)}
    >
      {children}
    </button>
  );
};