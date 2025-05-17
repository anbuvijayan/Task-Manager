import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_USER_DATA } from "../../utils/data";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
    } else {
      navigate(route);
    }
  };

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(SIDE_MENU_USER_DATA);
    } else {
      setSideMenuData([]);
    }
  }, [user]);

  return (
    <nav
      aria-label="Sidebar navigation"
      className="w-64 h-[calc(100vh-61px)] bg-white dark:bg-gray-900 border-r border-gray-200/50 dark:border-gray-700 sticky top-[61px] z-20"
    >
      {/* User Info */}
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <button
          type="button"
          onClick={() => navigate("/user/profile/edit")}
          title="Edit Profile"
          className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <img
            src={user?.profileImageUrl || "/default-user.png"}
            alt="Profile"
            className="w-20 h-20 bg-gray-300 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-user.png";
            }}
          />
        </button>

        <h5 className="text-gray-900 dark:text-white font-medium leading-6 mt-3">
          {user?.name || "Anonymous"}
        </h5>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {user?.email || "Email not available"}
        </p>
      </div>

      {/* Menu Items */}
      <ul role="menu" className="space-y-2 px-2">
        {sideMenuData.length === 0 ? (
          <li className="text-center text-gray-400 text-sm">No menu available</li>
        ) : (
          sideMenuData.map((item, index) => (
            <li key={`menu_${index}`} role="none">
              <button
                onClick={() => handleClick(item.path)}
                className={`w-full flex items-center gap-4 text-sm py-3 px-6 mb-3 cursor-pointer rounded
                  ${
                    activeMenu === item.label
                      ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
                role="menuitem"
                tabIndex={0}
              >
                {item.icon && <item.icon className="text-xl" aria-hidden="true" />}
                {item.label}
              </button>
            </li>
          ))
        )}
      </ul>
    </nav>
  );
};

export default SideMenu;
