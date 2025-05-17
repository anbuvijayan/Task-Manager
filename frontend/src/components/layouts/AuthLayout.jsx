import React from "react";
import { motion } from "framer-motion";

const AuthLayout = ({ children }) => {
  return (
    <motion.div
      className="min-h-screen w-full flex items-center justify-center px-4 bg-white dark:bg-gray-900 transition-colors duration-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6 tracking-wide">
          Task Manager
        </h2>
        {children}
      </div>
    </motion.div>
  );
};

export default AuthLayout;
