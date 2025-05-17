import React from "react";
import PropTypes from "prop-types";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const { name, value } = payload[0];

    return (
      <div
        className="bg-white shadow-lg rounded-md p-3 border border-gray-300"
        role="tooltip"
        aria-live="polite"
      >
        <p className="text-xs font-semibold text-purple-700 mb-1">{name}</p>
        <p className="text-sm text-gray-700">
          Count: <span className="font-semibold text-gray-900">{value}</span>
        </p>
      </div>
    );
  }

  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    })
  ),
};

export default CustomTooltip;
