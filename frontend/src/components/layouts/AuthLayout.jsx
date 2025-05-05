import React from "react";

const AuthLayout = ({ children }) => {
    return (
        <div className="flex">
            {/* Left side: Background image with overlay */}
            <div className="hidden md:flex w-[40vw] h-screen relative">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="w-full h-full bg-[url('/bg-img.png')] bg-cover bg-no-repeat bg-center z-0" />
            </div>

            {/* Right side: Glassmorphism Form Container */}
            <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12 flex flex-col justify-center backdrop-blur-lg bg-white/60 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 tracking-wide">Task Manager</h2>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
