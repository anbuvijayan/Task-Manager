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
    clearUser(); // Already removes localStorage & user context
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(SIDE_MENU_USER_DATA);
    } else {
      setSideMenuData([]); // Clear menu if no user
    }
  }, [user]);

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div
          className="relative cursor-pointer hover:opacity-80 transition"
          onClick={() => navigate("/user/profile/edit")}
          title="Edit Profile"
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
        </div>

        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || "Anonymous"}
        </h5>
        <p className="text-[12px] text-gray-500">
          {user?.email || "Email not available"}
        </p>
      </div>

      <div className="space-y-2 px-2">
        {sideMenuData.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">No menu available</p>
        ) : (
          sideMenuData.map((item, index) => (
            <button
              key={`menu_${index}`}
              onClick={() => handleClick(item.path)}
              className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 mb-3 cursor-pointer
                ${activeMenu === item.label
                  ? "text-blue-500 bg-gradient-to-r from-blue-50/40 to-blue-100/50 border-r-4 border-blue-500"
                  : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {item.icon && <item.icon className="text-xl" />}
              {item.label}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default SideMenu;
