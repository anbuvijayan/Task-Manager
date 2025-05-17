import React, { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../../context/userContext";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const sideMenuRef = useRef(null);

  if (!user) return <Navigate to="/login" />;

  const toggleSideMenu = () => setOpenSideMenu((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sideMenuRef.current && !sideMenuRef.current.contains(e.target)) {
        setOpenSideMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openSideMenu ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openSideMenu]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar activeMenu={activeMenu} toggleSideMenu={toggleSideMenu} />

      <div className="flex flex-grow overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <SideMenu activeMenu={activeMenu} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {openSideMenu && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
            onClick={() => setOpenSideMenu(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Sidebar */}
        <nav
          ref={sideMenuRef}
          className={`fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${
            openSideMenu ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-hidden={!openSideMenu}
          aria-label="Sidebar navigation"
        >
          <SideMenu activeMenu={activeMenu} />
        </nav>

        {/* Main Content */}
        <main className="flex-grow px-4 py-6 overflow-y-auto rounded-md">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
