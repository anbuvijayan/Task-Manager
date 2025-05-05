import React from "react";
import PropTypes from "prop-types";

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div
      className="flex items-center p-3 bg-white rounded-lg shadow border border-gray-200"
      role="region"
      aria-label={`${label}: ${value}`}
    >
      {icon && (
        <div className="mr-3 text-xl text-gray-600" aria-hidden="true">
          {icon}
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-5 ${color} rounded-full`} />
        <p className="text-xs md:text-sm text-gray-600">
          <span className="text-sm md:text-base text-black font-semibold">{value}</span> {label}
        </p>
      </div>
    </div>
  );
};

InfoCard.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired, // Tailwind color class, e.g., 'bg-blue-500'
};

export default InfoCard;
