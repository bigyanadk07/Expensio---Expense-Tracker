
import React from 'react';

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, type }) => {
  const getTextColor = () => {
    switch (type) {
      case 'income':
        return 'text-green-500';
      case 'expense':
        return 'text-red-500';
      case 'balance':
        return amount >= 0 ? 'text-green-500' : 'text-red-500';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className={`text-2xl font-bold ${getTextColor()}`}>
        ₹ {amount.toFixed(2)}
      </p>
    </div>
  );
};