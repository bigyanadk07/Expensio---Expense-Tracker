import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2, DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface Transaction {
  amount: number;
  category: string;
  date: string;
  description: string;
}

const Reports: React.FC = () => {
  const [income, setIncome] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          fetch('http://localhost:5000/income'),
          fetch('http://localhost:5000/expense')
        ]);
        
        const incomeData = await incomeRes.json();
        const expenseData = await expenseRes.json();
        
        setIncome(incomeData);
        setExpenses(expenseData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processMonthlyData = () => {
    const monthlyData: Record<string, { income: number; expenses: number }> = {};
    
    [...income, ...expenses].forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { income: 0, expenses: 0 };
      }
      
      if (income.includes(transaction)) {
        monthlyData[monthYear].income += transaction.amount;
      } else {
        monthlyData[monthYear].expenses += transaction.amount;
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data,
      savings: data.income - data.expenses
    }));
  };

  const processCategoryData = (transactions: Transaction[]) => {
    const categoryData: Record<string, number> = {};
    
    transactions.forEach((transaction) => {
      categoryData[transaction.category] = (categoryData[transaction.category] || 0) + transaction.amount;
    });

    return Object.entries(categoryData).map(([category, amount]) => ({
      category,
      amount
    }));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const monthlyData = processMonthlyData();
  const expenseCategoryData = processCategoryData(expenses);
  const incomeCategoryData = processCategoryData(income);

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const savingsRate = ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Financial Reports</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Income</p>
              <p className="text-2xl font-bold">NPR {totalIncome.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold">NPR {totalExpenses.toLocaleString()}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Savings Rate</p>
              <p className="text-2xl font-bold">{savingsRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-8">
        {/* Monthly Trends */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Monthly Financial Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#0088FE" name="Income" />
                <Line type="monotone" dataKey="expenses" stroke="#FF8042" name="Expenses" />
                <Line type="monotone" dataKey="savings" stroke="#00C49F" name="Savings" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Expense Categories */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Expense Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategoryData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {expenseCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Income Categories */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Income Sources</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;