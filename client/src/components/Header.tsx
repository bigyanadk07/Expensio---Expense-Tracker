// components/Header.tsx
import React from 'react';

interface HeaderProps {
  onAddExpense: () => void;
  onAddIncome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddExpense, onAddIncome }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <img src="src/assets/Expensio.png" className="w-52 h-auto" />
      <div className="flex space-x-2">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={onAddExpense}
        >
          Add Expense
        </button>
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={onAddIncome}
        >
          Add Income
        </button>
      </div>
    </div>
  );
};