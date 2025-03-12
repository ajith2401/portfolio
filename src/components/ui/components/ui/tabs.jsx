'use client';

import React, { useState, useEffect } from 'react';

export function Tabs({ value, onValueChange, children, className = '', ...props }) {
  const [activeTab, setActiveTab] = useState(value);

  useEffect(() => {
    setActiveTab(value);
  }, [value]);

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    onValueChange?.(tabValue);
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;

        if (child.type === TabsList) {
          return React.cloneElement(child, {
            activeTab,
            onTabChange: handleTabChange,
          });
        }
        
        if (child.type === TabsContent) {
          return React.cloneElement(child, {
            activeTab,
          });
        }

        return child;
      })}
    </div>
  );
}

export function TabsList({ activeTab, onTabChange, children, className = '', ...props }) {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 ${className}`}
      role="tablist"
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child) || child.type !== TabsTrigger) return null;

        return React.cloneElement(child, {
          active: child.props.value === activeTab,
          onClick: () => onTabChange(child.props.value),
        });
      })}
    </div>
  );
}

export function TabsTrigger({ value, active, onClick, children, className = '', ...props }) {
  // The key fix: Explicitly setting type="button" to prevent form submission
  return (
    <button
      type="button"  // This prevents the button from submitting forms
      role="tab"
      aria-selected={active}
      data-state={active ? 'active' : 'inactive'}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        active
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-500 hover:text-gray-900'
      } ${className}`}
      onClick={(e) => {
        e.preventDefault(); // Additional prevention of default behavior
        onClick();
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, activeTab, children, className = '', ...props }) {
  if (value !== activeTab) return null;

  return (
    <div
      role="tabpanel"
      data-state={value === activeTab ? 'active' : 'inactive'}
      className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}