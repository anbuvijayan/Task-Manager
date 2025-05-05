import React from "react";
import PropTypes from "prop-types";

const CustomLegend = ({ payload = [] }) => {
  if (!payload.length) return null;

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {payload.map((entry, index) => (
        <div className="flex items-center space-x-2" key={`legend-${index}`}>
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-700 font-medium">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

CustomLegend.propTypes = {
  payload: PropTypes.array,
};

export default CustomLegend;
