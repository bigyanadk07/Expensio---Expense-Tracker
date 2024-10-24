// components/TransactionList.tsx
import React from 'react';

interface Transaction {
  description: string;
  date: string;
  amount: number;
  category: string;
}

interface TransactionListProps {
  title: string;
  transactions: Transaction[];
  type: 'income' | 'expense';
}

export const TransactionList: React.FC<TransactionListProps> = ({ title, transactions, type }) => {
  const NoDataMessage = () => (
    <div className="text-center p-4 bg-gray-100 rounded-lg">
      <p className="text-gray-600">No data available. Start by adding some entries!</p>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {transactions.length > 0 ? (
        <ul className="space-y-2">
          {transactions.slice(-4).reverse().map((transaction, index) => (
            <li key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
              <p className={`font-semibold ${type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                ₹ {transaction.amount}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <NoDataMessage />
      )}
    </div>
  );
};