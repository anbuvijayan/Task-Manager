import React, { useState, useRef, useEffect } from "react";
import { LuChevronDown } from "react-icons/lu";

const SelectDropdown = ({ options, value, onChange, placeholder = "Select..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Dropdown Button */}
      <button
        type="button"
        ref={buttonRef}
        className="w-full text-sm text-gray-900 dark:text-white outline-none bg-white dark:bg-gray-800 border border-slate-300 dark:border-slate-600 px-3 py-2.5 rounded-md mt-2 flex justify-between items-center hover:ring-2 hover:ring-blue-500 transition"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {value ? options.find((opt) => opt.value === value)?.label : placeholder}
        <LuChevronDown
          className={`ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute w-full bg-white dark:bg-gray-800 border border-slate-300 dark:border-slate-600 rounded-md mt-1 shadow-md z-10"
          role="listbox"
        >
          {options.map((option) => (
            <div
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => handleSelect(option.value)}
              tabIndex={0}
              className={`px-4 py-2 text-sm text-white cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition ${
                option.value === value ? "bg-blue-50 dark:bg-gray-700" : ""
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSelect(option.value);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;
