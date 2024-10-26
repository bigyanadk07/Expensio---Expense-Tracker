import React, { useEffect, useState, useRef } from 'react';
import { toPng } from 'html-to-image';

interface DayData {
  date: Date;
  incoming: number;
  expenses: number;
  balance: number;
}

interface MonthData {
  totalIncoming: number;
  totalExpenses: number;
  totalBalance: number;
  maxIncoming: number;
  maxExpenses: number;
}

const ExpenseCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyData, setDailyData] = useState<{ [key: string]: DayData }>({});
  const [monthData, setMonthData] = useState<MonthData>({
    totalIncoming: 0,
    totalExpenses: 0,
    totalBalance: 0,
    maxIncoming: 0,
    maxExpenses: 0
  });
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  
  const calendarRef = useRef<HTMLDivElement>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    return { daysInMonth, startingDay };
  };

  // CSV Export Function
  const exportToCSV = () => {
    const headers = ['Date', 'Incoming (NPR)', 'Expenses (NPR)', 'Balance (NPR)'];
    const rows = Object.entries(dailyData).map(([date, data]) => [
      new Date(date).toLocaleDateString(),
      data.incoming,
      data.expenses,
      data.balance
    ]);
    
    const monthlyRow = [
      'Monthly Total',
      monthData.totalIncoming,
      monthData.totalExpenses,
      monthData.totalBalance
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
      '',
      monthlyRow.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `expense-report-${currentDate.toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportCalendarImage = async () => {
    if (calendarRef.current) {
      try {
        const dataUrl = await toPng(calendarRef.current, {
          quality: 1.0,
          backgroundColor: 'white',
        });
        
        const link = document.createElement('a');
        link.download = `finance-calendar-${currentDate.toLocaleDateString()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Error exporting calendar:', err);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomeResponse, expenseResponse] = await Promise.all([
          fetch('http://localhost:5000/income'),
          fetch('http://localhost:5000/expense')
        ]);

        const incomeData = await incomeResponse.json();
        const expenseData = await expenseResponse.json();

        const processedData: { [key: string]: DayData } = {};
        let monthlyIncoming = 0;
        let monthlyExpenses = 0;
        let maxIncoming = 0;
        let maxExpenses = 0;

        // Filter data for current month
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        incomeData.forEach((income: any, index: number) => {
          const date = new Date(income.date);
          // Only process data for the current month
          if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            const dateKey = date.toISOString().split('T')[0];
            const expenses = expenseData[index]?.amount || 0;
            const balance = income.amount - expenses;

            processedData[dateKey] = {
              date,
              incoming: income.amount,
              expenses,
              balance
            };

            monthlyIncoming += income.amount;
            monthlyExpenses += expenses;
            maxIncoming = Math.max(maxIncoming, income.amount);
            maxExpenses = Math.max(maxExpenses, expenses);
          }
        });

        setDailyData(processedData);
        setMonthData({
          totalIncoming: monthlyIncoming,
          totalExpenses: monthlyExpenses,
          totalBalance: monthlyIncoming - monthlyExpenses,
          maxIncoming,
          maxExpenses
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentDate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getHeatmapStyle = (dayData: DayData) => {
    if (!dayData) return {};

    const incomeIntensity = Math.min((dayData.incoming / monthData.maxIncoming) * 0.5, 0.5);
    const expenseIntensity = Math.min((dayData.expenses / monthData.maxExpenses) * 0.5, 0.5);

    return {
      background: `linear-gradient(135deg, 
        rgba(34, 197, 94, ${incomeIntensity}), 
        rgba(239, 68, 68, ${expenseIntensity}))`
    };
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
    const days = [];

    for (let i = 0; i < startingDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 bg-gray-50 border border-gray-200" />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = date.toISOString().split('T')[0];
      const dayData = dailyData[dateKey];

      days.push(
        <div 
          key={day} 
          className="h-24 border border-gray-200 p-2 cursor-pointer transition-all hover:shadow-lg relative"
          style={getHeatmapStyle(dayData)}
          onClick={() => setSelectedDay(dayData)}
        >
          <div className="font-bold text-sm mb-1 z-10 relative">
            {date.toLocaleString('default', { month: 'short', day: 'numeric' })}
          </div>
          {dayData ? (
            <div className="text-xs space-y-1 z-10 relative">
              <div className="text-green-600 font-medium">
                In: {formatCurrency(dayData.incoming)}
              </div>
              <div className="text-red-600 font-medium">
                Out: {formatCurrency(dayData.expenses)}
              </div>
              <div className={`font-medium ${dayData.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Bal: {formatCurrency(dayData.balance)}
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-400">No data</div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className=' bg-gray-50'>
      <div className="max-w-[1500px] mx-auto p-4 ">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Finance Calendar</h1>
        <div className="flex gap-2">
          <button 
            onClick={exportToCSV}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <span>📥</span> Export CSV
          </button>
          <button 
            onClick={exportCalendarImage}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          >
            <span>📷</span> Export Calendar
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Monthly Summary Sidebar */}
        <div className="w-64 bg-white rounded-lg shadow p-4 h-fit">
          <h2 className="text-lg font-bold mb-4 text-center">Monthly Summary for <span className='text-orange-400'>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span></h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600">Total Income</div>
              <div className="text-lg font-medium text-green-600">
                {formatCurrency(monthData.totalIncoming)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Expenses</div>
              <div className="text-lg font-medium text-red-600">
                {formatCurrency(monthData.totalExpenses)}
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="text-sm text-gray-600">Net Balance</div>
              <div className={`text-lg font-medium ${monthData.totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(monthData.totalBalance)}
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-6 pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Heatmap Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 bg-opacity-50 rounded"></div>
                <span className="text-xs">High Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 bg-opacity-50 rounded"></div>
                <span className="text-xs">High Expenses</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-red-500 opacity-50 rounded"></div>
                <span className="text-xs">Mixed Activity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div ref={calendarRef} className="flex-1 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 bg-gray-50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-2 text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {renderCalendar()}
          </div>
        </div>
      </div>

      {/* Day Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={() => setSelectedDay(null)}>
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">
              {selectedDay.date.toLocaleDateString('default', { dateStyle: 'full' })}
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Income</div>
                <div className="text-lg font-medium text-green-600">
                  {formatCurrency(selectedDay.incoming)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Expenses</div>
                <div className="text-lg font-medium text-red-600">
                  {formatCurrency(selectedDay.expenses)}
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600">Net Balance</div>
                <div className={`text-lg font-medium ${selectedDay.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(selectedDay.balance)}
                </div>
              </div>
            </div>
            <button 
              className="mt-6 w-full py-2 bg-gray-100 rounded hover:bg-gray-200"
              onClick={() => setSelectedDay(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ExpenseCalendar;