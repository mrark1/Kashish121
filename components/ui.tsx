import React from 'react';
import { X } from 'lucide-react';

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

export const Button = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  type = 'button'
}: { 
  onClick?: () => void, 
  children: React.ReactNode, 
  variant?: 'primary' | 'secondary' | 'danger' | 'outline', 
  className?: string,
  disabled?: boolean,
  type?: 'button' | 'submit' | 'reset'
}) => {
  const baseStyle = "px-4 py-2 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-amazon-blue text-white hover:bg-opacity-90 focus:ring-amazon-blue dark:bg-sky-600 dark:hover:bg-sky-700",
    secondary: "bg-amazon-orange text-white hover:bg-yellow-500 focus:ring-yellow-500 text-gray-900",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = ({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  placeholder = "",
  className = "",
  readOnly = false
}: { 
  label?: string, 
  value: string | number, 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, 
  type?: string,
  placeholder?: string,
  className?: string,
  readOnly?: boolean
}) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-amazon-blue focus:border-amazon-blue outline-none transition-shadow bg-white dark:bg-gray-700 dark:text-white ${readOnly ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''}`}
    />
  </div>
);

export const Badge = ({ children, color = 'gray' }: { children: React.ReactNode, color?: 'gray' | 'red' | 'green' | 'blue' | 'yellow' }) => {
  const colors = {
    gray: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
};

export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export const SlideOver = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  return (
    <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose} />
      <div className={`relative bg-white dark:bg-gray-800 w-full max-w-md h-full shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 text-gray-800 dark:text-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
};
