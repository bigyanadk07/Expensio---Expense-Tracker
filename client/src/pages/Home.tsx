import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Header } from '../components/Header';
import { SummaryCard } from '../components/SummaryCard';
import { ChartSection } from '../components/ChartSection';
import { TransactionList } from '../components/TransactionList';
import { Modal } from '../components/Modal';
import { TransactionForm } from '../components/TransactionForm';
import { Loader2, AlertCircle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Home: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [income, setIncome] = useState<any[]>([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [expenseResponse, incomeResponse] = await Promise.all([
        axios.get('http://localhost:5000/expense'),
        axios.get('http://localhost:5000/income')
      ]);
      setExpenses(expenseResponse.data);
      setIncome(incomeResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTotalExpense(expenses.reduce((sum, expense) => sum + expense.amount, 0));
    setTotalIncome(income.reduce((sum, inc) => sum + inc.amount, 0));
  }, [expenses, income]);

  const handleSubmitExpense = async (data: { amount: number; category: string }) => {
    try {
      const response = await axios.post('http://localhost:5000/expense', data);
      console.log('Expense added:', response.data);
      fetchData();
      setIsExpenseModalOpen(false);
    } catch (error) {
      console.error('Error adding expense:', error.response?.data);
    }
  };

  const handleSubmitIncome = async (data: { amount: number; category: string; date: string; description: string}) => {
    try {
      const response = await axios.post('http://localhost:5000/income', data);
      console.log('Income added successfully:', response.data);
      fetchData();
      setIsIncomeModalOpen(false);
    } catch (error) {
      console.error('Error adding income:', error.response?.data || error.message);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      title: {
        display: true,
        text: 'Category Distribution',
        font: {
          size: 16,
          family: "'Inter', sans-serif",
          weight: 'bold'
        },
        padding: 20
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          }
        }
      }
    },
  };

  const getChartData = (data: any[], label: string, colors: string[]) => {
    const categories = data.reduce((acc: any, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});

    return {
      labels: Object.keys(categories),
      datasets: [{
        label,
        data: Object.values(categories),
        backgroundColor: colors,
        borderRadius: 6,
        borderSkipped: false,
      }],
    };
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onAddExpense={() => setIsExpenseModalOpen(true)} 
        onAddIncome={() => setIsIncomeModalOpen(true)} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard 
            title="Total Income" 
            amount={totalIncome} 
            type="income"
            className="transform transition-all duration-200 hover:scale-[1.02]" 
          />
          <SummaryCard 
            title="Total Expense" 
            amount={totalExpense} 
            type="expense"
            className="transform transition-all duration-200 hover:scale-[1.02]" 
          />
          <SummaryCard 
            title="Balance" 
            amount={totalIncome - totalExpense} 
            type="balance"
            className="transform transition-all duration-200 hover:scale-[1.02]" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <ChartSection
              title="Expense Distribution"
              data={getChartData(expenses, 'Expenses by Category', [
                'rgba(239, 68, 68, 0.6)',
                'rgba(59, 130, 246, 0.6)',
                'rgba(245, 158, 11, 0.6)',
                'rgba(16, 185, 129, 0.6)',
                'rgba(139, 92, 246, 0.6)',
              ])}
              options={chartOptions}
              categories={expenses.reduce((acc: any, expense) => {
                acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
                return acc;
              }, {})}
            />
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <ChartSection
              title="Income Distribution"
              data={getChartData(income, 'Income by Category', [
                'rgba(16, 185, 129, 0.6)',
                'rgba(139, 92, 246, 0.6)',
                'rgba(245, 158, 11, 0.6)',
                'rgba(59, 130, 246, 0.6)',
                'rgba(167, 139, 250, 0.6)',
              ])}
              options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: 'Income by Category'}}}}
              categories={income.reduce((acc: any, inc) => {
                acc[inc.category] = (acc[inc.category] || 0) + inc.amount;
                return acc;
              }, {})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <TransactionList title="Recent Expenses" transactions={expenses} type="expense" />
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <TransactionList title="Recent Income" transactions={income} type="income" />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title="Add New Expense"
      >
        <TransactionForm
          type="expense"
          onSubmit={handleSubmitExpense}
          onClose={() => setIsExpenseModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        title="Add New Income"
      >
        <TransactionForm
          type="income"
          onSubmit={handleSubmitIncome}
          onClose={() => setIsIncomeModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Home;