import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Header: React.FC = () => {
  const { logout, isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = (allDevices: boolean) => {
    logout(allDevices ? "all" : "current");
    setIsOpen(false);
  };

  return (
    <header className="bg-gray-900 text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          CertifyPro
        </Link>
        <nav className="flex space-x-4">
          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="hover:text-gray-400 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-gray-400 transition duration-300"
              >
                Register
              </Link>
            </>
          )}
          {isAuthenticated && (
            <>
              <Link
                to="/admin/dashboard"
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Dashboard
              </Link>
              <button
                onClick={() => setIsOpen(true)}
                className="hover:text-gray-400 transition duration-300"
              >
                Logout ({user?.email.split("@")[0]})
              </button>
              {isOpen && (
                <div className="absolute mt-10 top-5 right-5  z-10 bg-white p-4 rounded shadow">
                  <p className="text-sm text-gray-700 mb-4">
                    Are you sure you want to logout?
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleLogout(true)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-300"
                    >
                      Logout from all devices
                    </button>
                    <button
                      onClick={() => handleLogout(false)}
                      className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-300"
                    >
                      Logout from this device
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
