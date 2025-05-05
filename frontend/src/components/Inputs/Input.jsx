import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

    return (
        <div>
            <label className="text-[13px] text-slate-800">
                {label}
            </label>

            <div className="input-box flex items-center border px-2 py-1 rounded">
                <input
                    autoComplete="off"
                    type={inputType}
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none"
                    value={value}
                    onChange={onChange}
                />


                {type === "password" && (
                    showPassword ? (
                        <FaRegEye
                            size={22}
                            className="text-primary cursor-pointer"
                            onClick={togglePasswordVisibility}
                        />
                    ) : (
                        <FaRegEyeSlash
                            size={22}
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