import React from "react";
import PropTypes from "prop-types";

const CustomLegend = ({ payload = [] }) => {
  if (!payload.length) return null;

  return (
    <div
      className="flex flex-wrap justify-center gap-3 mt-4"
      role="list"
      aria-label="Chart legend"
    >
      {payload.map((entry, index) => (
        <div
          className="flex items-center space-x-2"
          key={`legend-${index}`}
          role="listitem"
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-700 font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

CustomLegend.propTypes = {
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
      value: PropTypes.string,
    })
  ),
};

export default CustomLegend;
