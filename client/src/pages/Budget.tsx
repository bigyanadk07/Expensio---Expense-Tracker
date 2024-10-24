import React, { useState, useEffect } from 'react';

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  date: string;
}

interface CategoryBudget {
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
}

const Budget: React.FC = () => {
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [newBudget, setNewBudget] = useState({ category: '', limit: 0 });
  const [showAddBudget, setShowAddBudget] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expenseRes, incomeRes] = await Promise.all([
          fetch('http://localhost:5000/expense'),
          fetch('http://localhost:5000/income')
        ]);

        const expenseData = await expenseRes.json();
        const incomeData = await incomeRes.json();

        setExpenses(expenseData);
        setIncomes(incomeData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Calculate totals and budgets
  useEffect(() => {
    // Calculate total income and expenses
    const totalInc = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExp = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalIncome(totalInc);
    setTotalExpenses(totalExp);

    // Calculate category-wise spending
    const categorySpending = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    // Update budgets with actual spending
    const updatedBudgets = budgets.map(budget => {
      const spent = categorySpending[budget.category] || 0;
      return {
        ...budget,
        spent,
        remaining: budget.limit - spent,
        percentage: (spent / budget.limit) * 100
      };
    });

    setBudgets(updatedBudgets);
  }, [expenses, incomes]);

  // Add new budget
  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBudget.category && newBudget.limit > 0) {
      setBudgets([...budgets, {
        ...newBudget,
        spent: 0,
        remaining: newBudget.limit,
        percentage: 0
      }]);
      setNewBudget({ category: '', limit: 0 });
      setShowAddBudget(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Budget Dashboard</h1>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Total Income</h2>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Total Expenses</h2>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Remaining</h2>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalIncome - totalExpenses)}</p>
          </div>
        </div>

        {/* Budget Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Category Budgets</h2>
            <button
              onClick={() => setShowAddBudget(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Add Budget
            </button>
          </div>

          {/* Add Budget Form */}
          {showAddBudget && (
            <form onSubmit={handleAddBudget} className="mb-6 p-4 bg-gray-50 rounded">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Category"
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  className="p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Budget Limit"
                  value={newBudget.limit || ''}
                  onChange={(e) => setNewBudget({ ...newBudget, limit: Number(e.target.value) })}
                  className="p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddBudget(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Save Budget
                </button>
              </div>
            </form>
          )}

          {/* Budget List */}
          <div className="space-y-4">
            {budgets.map((budget) => (
              <div key={budget.category} className="border rounded p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800">{budget.category}</h3>
                  <span className="text-sm text-gray-600">
                    {formatCurrency(budget.spent)} of {formatCurrency(budget.limit)}
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
                  <div 
                    className={`h-full ${budget.percentage > 90 ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                  <span>{budget.percentage.toFixed(1)}% spent</span>
                  <span>{formatCurrency(budget.remaining)} remaining</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;