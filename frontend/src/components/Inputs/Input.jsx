import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type = "text", id }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}

      <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-blue-500 transition">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          autoComplete="off"
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder:text-slate-400"
        />

        {type === "password" && (
          showPassword ? (
            <FaRegEye
              size={20}
              className="text-blue-600 cursor-pointer"
              onClick={togglePasswordVisibility}
            />
          ) : (
            <FaRegEyeSlash
              size={20}
              className="text-slate-400 cursor-pointer"
              onClick={togglePasswordVisibility}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Input;
