import React, { useState } from 'react';

interface TransactionFormProps {
  type: 'income' | 'expense';
  onSubmit: (data: any) => void;
  onClose: () => void;
}

const DEFAULT_EXPENSE_CATEGORIES = ['Food', 'Bills', 'Home Utilities', 'Entertainment', 'Rent', 'Other'];
const DEFAULT_INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Business', 'Other'];

export const TransactionForm: React.FC<TransactionFormProps> = ({ type, onSubmit, onClose }) => {
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [focused, setFocused] = useState<string>('');

  const categories = type === 'expense' ? DEFAULT_EXPENSE_CATEGORIES : DEFAULT_INCOME_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      amount,
      category: category === 'Other' ? customCategory : category,
      date,
      description,
      type,
    };
    onSubmit(data);
    onClose();
  };

  const getInputClasses = (fieldName: string) => `
    w-full px-4 py-3.5 bg-white border-2 rounded-xl
    ${focused === fieldName 
      ? `border-transparent ring-4 ${type === 'income' ? 'ring-emerald-100' : 'ring-indigo-100'}` 
      : 'border-gray-100 hover:border-gray-200'
    }
    transition-all duration-300 ease-in-out
    placeholder-gray-400
    text-gray-800 text-base
    shadow-sm hover:shadow-md
  `;

  return (
    <div className="w-full max-w-3xl mx-auto transform transition-all duration-300 hover:scale-[1.01]">
      <div className={`bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border border-gray-100`}>
        {/* Header Section */}
        <div className={`px-12 py-8 ${
          type === 'income' 
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
            : 'bg-gradient-to-r from-indigo-500 to-purple-500'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                New {type.charAt(0).toUpperCase() + type.slice(1)}
              </h2>
              <p className="text-sm text-white/90">
                Fill in the details below to add your transaction
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-12">
          <div className="space-y-6">
            {/* Amount Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 ml-1">
                Amount
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="text-gray-400 text-lg group-hover:text-gray-600 transition-colors duration-200">$</span>
                </div>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  min="0"
                  step="0.01"
                  className={`${getInputClasses('amount')} pl-8`}
                  onFocus={() => setFocused('amount')}
                  onBlur={() => setFocused('')}
                />
              </div>
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 ml-1">
                Category
              </label>
              <div className="relative group">
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (e.target.value !== 'Other') setCustomCategory('');
                  }}
                  required
                  className={`${getInputClasses('category')} appearance-none cursor-pointer`}
                  onFocus={() => setFocused('category')}
                  onBlur={() => setFocused('')}
                >
                  <option value="">Choose a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="py-2">
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Custom Category Field */}
            {category === 'Other' && (
              <div className="space-y-2 animate-fadeIn">
                <label className="block text-sm font-medium text-gray-700 ml-1">
                  Custom Category
                </label>
                <input
                  type="text"
                  placeholder="Enter a custom category name"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  required
                  className={getInputClasses('customCategory')}
                  onFocus={() => setFocused('customCategory')}
                  onBlur={() => setFocused('')}
                />
              </div>
            )}

            {/* Date Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 ml-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className={getInputClasses('date')}
                onFocus={() => setFocused('date')}
                onBlur={() => setFocused('')}
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 ml-1">
                Description
              </label>
              <textarea
                placeholder="What's this transaction about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className={`${getInputClasses('description')} resize-none`}
                onFocus={() => setFocused('description')}
                onBlur={() => setFocused('')}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 border-2 border-gray-200 text-gray-600 font-medium rounded-xl
                hover:bg-gray-50 hover:border-gray-300 hover:shadow-md
                focus:outline-none focus:ring-4 focus:ring-gray-100
                transition-all duration-300 ease-in-out"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-8 py-3.5 font-medium rounded-xl
                focus:outline-none focus:ring-4
                transition-all duration-300 ease-in-out transform hover:scale-105
                ${type === 'income' 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white focus:ring-emerald-100' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white focus:ring-indigo-100'
                }
                shadow-lg hover:shadow-xl`}
            >
              Save {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          </div>
        </form>
      </div>

      {/* Help Text */}
      <p className="text-center text-sm text-gray-500 mt-4 px-4">
        Double-check your information before saving. You can edit this {type} later if needed.
      </p>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TransactionForm;