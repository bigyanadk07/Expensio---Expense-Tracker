import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Header } from '../components/Header';
import { SummaryCard } from '../components/SummaryCard';
import { ChartSection } from '../components/ChartSection';
import { TransactionList } from '../components/TransactionList';
import { Modal } from '../components/Modal';
import { TransactionForm } from '../components/TransactionForm';

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

  // Separate function to handle Expense submission
  const handleSubmitExpense = async (data: { amount: number; category: string }) => {
    try {
      const response = await axios.post('http://localhost:5000/expense', data);
      console.log('Expense added:', response.data);
      fetchData();
    } catch (error) {
      console.error('Error adding expense:', error.response?.data);
    }
  };

  const handleSubmitIncome = async (data: { amount: number; category: string; date: string; description: string}) => {
    try {
      const response = await axios.post('http://localhost:5000/income', data);
      console.log('Income added successfully:', response.data);
      fetchData();
    } catch (error) {
      console.error('Error adding income:', error.response?.data || error.message);
    }
  };
  
  


  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Category Distribution' },
    },
    scales: { y: { beginAtZero: true } },
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
      }],
    };
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Header 
        onAddExpense={() => setIsExpenseModalOpen(true)} 
        onAddIncome={() => setIsIncomeModalOpen(true)} 
      />

      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title="Add New Expense"
      >
        <TransactionForm
          type="expense"
          onSubmit={handleSubmitExpense} // Use handleSubmitExpense for expense
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
          onSubmit={handleSubmitIncome} // Use handleSubmitIncome for income
          onClose={() => setIsIncomeModalOpen(false)}
        />
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard title="Total Income" amount={totalIncome} type="income" />
        <SummaryCard title="Total Expense" amount={totalExpense} type="expense" />
        <SummaryCard title="Balance" amount={totalIncome - totalExpense} type="balance" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartSection
          title="Expense Distribution"
          data={getChartData(expenses, 'Expenses by Category', [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ])}
          options={chartOptions}
          categories={expenses.reduce((acc: any, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
          }, {})}
        />
        <ChartSection
          title="Income Distribution"
          data={getChartData(income, 'Income by Category', [
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
          ])}
          options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: 'Income by Category'}}}}
          categories={income.reduce((acc: any, inc) => {
            acc[inc.category] = (acc[inc.category] || 0) + inc.amount;
            return acc;
          }, {})}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TransactionList title="Recent Expenses" transactions={expenses} type="expense" />
        <TransactionList title="Recent Income" transactions={income} type="income" />
      </div>
    </div>
  );
};

export default Home;
