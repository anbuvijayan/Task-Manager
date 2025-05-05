import React from 'react';
import PropTypes from 'prop-types';

const Progress = ({ progress = 0, status = 'Pending' }) => {
  const normalizedProgress = Math.max(0, Math.min(progress, 100));

  const getColor = () => {
    switch (status) {
      case 'In Progress':
        return 'bg-cyan-500';
      case 'Completed':
        return 'bg-indigo-500';
      default:
        return 'bg-violet-500'; // Pending or unknown
    }
  };

  return (
    <div
      className="w-full bg-gray-200 rounded-full h-2 mt-2"
      role="progressbar"
      aria-valuenow={normalizedProgress}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label={`Progress: ${normalizedProgress}%`}
    >
      <div
        className={`h-2 rounded-full transition-all duration-300 ease-in-out ${getColor()}`}
        style={{ width: `${normalizedProgress}%` }}
      />
    </div>
  );
};

Progress.propTypes = {
  progress: PropTypes.number,
  status: PropTypes.string,
};

export default Progress;
