import React from "react";
import { HiOutlineMenu } from "react-icons/hi";

const Navbar = ({ toggleSideMenu }) => {
  return (
    <header className="navbar flex items-center gap-4 bg-white border-b border-gray-200/70 py-4 px-6 sticky top-0 z-40 shadow-sm">
      <button
        onClick={toggleSideMenu}
        aria-label="Toggle side menu"
        className="block lg:hidden text-gray-700 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
      >
        <HiOutlineMenu className="text-2xl" />
      </button>

      <h1 className="text-lg font-semibold text-gray-800">
        Task Manager
      </h1>
    </header>
  );
};

export default Navbar;
