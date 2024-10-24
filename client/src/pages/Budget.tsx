import React, { useState, useEffect } from 'react';
import { Trash2, TrendingUp, TrendingDown, DollarSign, PieChart, AlertCircle, Plus, X } from 'lucide-react';

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
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

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

  const getStatusColor = (percentage: number): string => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getProgressBarColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500 flex items-center gap-2">
          <AlertCircle />
          <span>{error}</span>
        </div>
      </div>
    );
  }
  

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Budget Dashboard</h1>
        <p className="text-gray-600">Track, manage, and optimize your spending</p>
      </div>

      {/* Time Frame Selector */}
      <div className="mb-6">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
          {['month', 'quarter', 'year'].map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${selectedTimeframe === timeframe 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-500 hover:text-gray-700'}`}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards with Enhanced Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-400">Total Income</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(totalIncome)}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {incomes.length} income transactions
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-sm font-medium text-gray-400">Total Expenses</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(totalExpenses)}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {expenses.length} expense transactions
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-400">Net Balance</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(totalIncome - totalExpenses)}</h3>
            <p className="text-sm text-gray-500 mt-1">
              Available to spend
            </p>
          </div>
        </div>
      </div>

      {/* Budget Management Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Category Budgets</h2>
              <p className="text-sm text-gray-500 mt-1">Manage your spending limits</p>
            </div>
            <button
              onClick={() => setShowAddBudget(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Budget
            </button>
          </div>
        </div>

        {/* Add Budget Form with Enhanced Design */}
        {showAddBudget && (
          <div className="border-b border-gray-100">
            <form onSubmit={handleAddBudget} className="p-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Groceries"
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Limit
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={newBudget.limit || ''}
                    onChange={(e) => setNewBudget({ ...newBudget, limit: Number(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBudget(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Budget List with Enhanced Design */}
        <div className="divide-y divide-gray-100">
          {budgets.map((budget) => (
            <div key={budget._id || budget.category} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${budget.percentage >= 90 ? 'bg-red-100' : 'bg-blue-100'}`}>
                    <PieChart className={`h-5 w-5 ${budget.percentage >= 90 ? 'text-red-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{budget.category}</h3>
                    <p className="text-sm text-gray-500">Monthly Budget</p>
                  </div>
                </div>
                <button
                  onClick={() => budget._id && handleDeleteBudget(budget._id)}
                  disabled={isDeleting === budget._id}
                  className={`p-2 rounded-lg hover:bg-red-100 text-red-500 transition-colors
                    ${isDeleting === budget._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Delete Budget"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className={getStatusColor(budget.percentage)}>
                    {budget.percentage.toFixed(1)}% used
                  </span>
                  <span className="text-gray-600">
                    {formatCurrency(budget.spent)} of {formatCurrency(budget.limit)}
                  </span>
                </div>
                
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${getProgressBarColor(budget.percentage)}`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    {formatCurrency(budget.remaining)} remaining
                  </span>
                  <span className={`font-medium ${getStatusColor(budget.percentage)}`}>
                    {budget.percentage >= 90 ? 'Over Budget' : 
                     budget.percentage >= 75 ? 'Warning' : 'On Track'}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {budgets.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p className="mb-2">No budgets set up yet</p>
              <p className="text-sm">Click the "Add Budget" button to create your first budget category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Budget;