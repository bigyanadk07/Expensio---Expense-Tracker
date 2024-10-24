import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  date: string;
}

interface CategoryBudget {
  _id?: string;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch all data including budgets
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [expenseRes, incomeRes, budgetRes] = await Promise.all([
          fetch('http://localhost:5000/expense'),
          fetch('http://localhost:5000/income'),
          fetch('http://localhost:5000/budget')
        ]);

        const expenseData = await expenseRes.json();
        const incomeData = await incomeRes.json();
        const budgetData = await budgetRes.json();

        setExpenses(expenseData);
        setIncomes(incomeData);
        // Initialize budgets with spent, remaining, and percentage
        const initializedBudgets = budgetData.map((budget: CategoryBudget) => ({
          ...budget,
          spent: 0,
          remaining: budget.limit,
          percentage: 0
        }));
        setBudgets(initializedBudgets);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate totals and update budgets with actual spending
  useEffect(() => {
    // Calculate total income and expenses
    const totalInc = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExp = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalIncome(totalInc);
    setTotalExpenses(totalExp);

    // Calculate category-wise spending and update budgets
    const categorySpending = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    setBudgets(prevBudgets => 
      prevBudgets.map(budget => {
        const spent = categorySpending[budget.category] || 0;
        return {
          ...budget,
          spent,
          remaining: budget.limit - spent,
          percentage: (spent / budget.limit) * 100
        };
      })
    );
  }, [expenses, incomes]); // Remove budgets from dependency array

  // Rest of the component remains the same...
  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newBudget.category && newBudget.limit > 0) {
      try {
        const response = await fetch('http://localhost:5000/budget', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category: newBudget.category,
            limit: newBudget.limit
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create budget');
        }

        const newBudgetData = await response.json();
        setBudgets(prevBudgets => [...prevBudgets, {
          ...newBudgetData,
          spent: 0,
          remaining: newBudgetData.limit,
          percentage: 0
        }]);
        
        setNewBudget({ category: '', limit: 0 });
        setShowAddBudget(false);
      } catch (error) {
        console.error('Error creating budget:', error);
        setError('Failed to create budget. Please try again.');
      }
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    if (!budgetId) return;
    
    setIsDeleting(budgetId);
    try {
      const response = await fetch(`http://localhost:5000/budget/${budgetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete budget');
      }

      // Remove the budget from state
      setBudgets(prevBudgets => prevBudgets.filter(budget => budget._id !== budgetId));
    } catch (error) {
      console.error('Error deleting budget:', error);
      setError('Failed to delete budget. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NPR'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

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
              <div key={budget._id || budget.category} className="border rounded p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-gray-800">{budget.category}</h3>
                    <button
                      onClick={() => budget._id && handleDeleteBudget(budget._id)}
                      disabled={isDeleting === budget._id}
                      className={`p-1.5 rounded-full hover:bg-red-100 text-red-500 transition-colors
                        ${isDeleting === budget._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title="Delete Budget"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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