import { useState } from "react";
import AppRoutes from "./Routes";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import { HiBars3, HiXMark } from "react-icons/hi2";

function App() {
  const auth = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return auth.loaded && (
    <div className="max-w-6xl mx-auto p-4">
      <nav className="bg-gray-100 mb-6 p-2 rounded-lg">
        <div className="flex flex-wrap items-center justify-between">
          <Link to="/" className="px-2 font-bold text-gray-600 text-xl">
            Scratch
          </Link>

          <button
            onClick={toggleNavbar}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-200"
          >
            {isOpen ? <HiXMark size="20" /> : <HiBars3 size="20" />}
          </button>

          <div
            className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
          >
            <div className="flex flex-col mt-4 md:flex-row md:mt-0 md:ml-4 md:items-center md:justify-end">
              {auth.loggedIn ? (
                <>
                  <Link
                    to="/settings"
                  >
                    <button
                      className="px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 font-medium cursor-pointer text-left"
                    >
                      Settings
                    </button>
                  </Link>
                  <button
                    onClick={auth.logout}
                    className="px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 font-medium cursor-pointer text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={auth.login}
                  className="px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 font-medium cursor-pointer text-left"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <AppRoutes />
    </div>
  );
}

export default App;
