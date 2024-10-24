// components/ChartSection.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';

interface ChartSectionProps {
  title: string;
  data: any;
  options: any;
  categories: Record<string, number>;
}

export const ChartSection: React.FC<ChartSectionProps> = ({ title, data, options, categories }) => {
  const NoDataMessage = () => (
    <div className="text-center p-4 bg-gray-100 rounded-lg">
      <p className="text-gray-600">No data available. Start by adding some entries!</p>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {Object.keys(categories).length > 0 ? (
        <Bar data={data} options={options} />
      ) : (
        <NoDataMessage />
      )}
    </div>
  );
};