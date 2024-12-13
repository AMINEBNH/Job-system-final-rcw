import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = ({ isLoggedIn, userName, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="navBar flex justify-between items-center px-10 py-6 bg-gray-100 shadow-md">
      <div className="logoDiv">
        <h1 className="logo text-[30px] font-bold text-blue-600">
          <span className="text-black">Job</span>Lite
        </h1>
      </div>

      <div className="menu flex items-center gap-8">
        <li className="menuList text-[#6f6f6f] hover:text-blue-600 font-medium">
          <Link to="/companies">Companies</Link>
        </li>
        <li className="menuList text-[#6f6f6f] hover:text-blue-600 font-medium">
          <Link to="/home">Jobs</Link>
        </li>

        {isLoggedIn ? (
          <>
            <li
              className="menuList text-[#6f6f6f] hover:text-blue-600 font-medium cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              Bonjour, <span className="text-blue-600 font-semibold">{userName}</span>
            </li>
            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-200"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-200">
                  Login
                </button>
              </Link>
            </li>
            <li>
              <Link to="/signup">
                <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition duration-200">
                  Register
                </button>
              </Link>
            </li>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;