import React from "react";

const AuthLayout = ({ children }) => {
    return (
        <div className="flex h-screen w-screen">
            {/* Left side with subtle SVG pattern */}
            <div className="hidden md:flex w-[40vw] h-full relative bg-sky-800">
                <svg
                    className="absolute inset-0 w-full h-full text-gray-300"
                    fill="none"
                >
                    <defs>
                        <pattern
                            id="diagonal-stripes"
                            width="40"
                            height="40"
                            patternUnits="userSpaceOnUse"
                            patternTransform="rotate(45)"
                        >
                            <rect width="2" height="40" fill="currentColor" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#diagonal-stripes)" />
                </svg>


            </div>

            {/* Right side with form */}
            <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12 flex flex-col justify-center backdrop-blur-lg bg-white/60 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 tracking-wide">Task Manager</h2>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
