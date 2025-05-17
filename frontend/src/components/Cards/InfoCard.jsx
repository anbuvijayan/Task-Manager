import React from "react";
import PropTypes from "prop-types";

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div
      className="flex items-center"
      role="region"
      aria-label={`${label}: ${value}`}
    >
      {icon && (
        <div className="mr-3 text-xl text-gray-600 flex-shrink-0" aria-hidden="true">
          {icon}
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {/* Color box */}
        <div className={`w-2.5 h-5 ${color} rounded-full flex-shrink-0`} />
        <p className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
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
  color: PropTypes.string.isRequired,
};

export default InfoCard;
