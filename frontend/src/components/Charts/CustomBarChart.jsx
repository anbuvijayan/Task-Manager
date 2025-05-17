import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const CustomBarChart = ({ data }) => {
  // Function to return color based on priority
  const getBarColor = (entry) => {
    switch (entry?.priority) {
      case 'Low':
        return '#00BC7D';
      case 'Medium':
        return '#FE9900';
      case 'High':
        return '#FF1F57';
      default:
        return '#00BC7D'; // Fallback color
    }
  };

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-xs font-semibold text-purple-800 mb-1">
            {payload[0].payload.priority}
          </p>
          <p className="text-sm text-gray-600">
            Count:{' '}
            <span className="text-sm font-medium text-gray-900">
              {payload[0].payload.count}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Show fallback if no data
  if (!data || data.length === 0) {
    return (
      <div className="bg-white mt-6 p-4 rounded-lg shadow-lg text-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div
      className="mt-6 p-4 rounded-lg"
      aria-label="Task priority bar chart"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />
          <XAxis
            dataKey="priority"
            tick={{ fontSize: 12, fill: '#555' }}
            stroke="none"
          />
          <YAxis tick={{ fontSize: 12, fill: '#555' }} stroke="none" />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          <Bar
            dataKey="count"
            nameKey="priority"
            radius={[10, 10, 0, 0]} // Rounded top corners
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// PropTypes for validation
CustomBarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      priority: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default CustomBarChart;
