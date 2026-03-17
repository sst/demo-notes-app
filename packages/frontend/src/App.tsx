import { useState } from "react";
import { Link } from "react-router-dom";
import { HiBars3, HiXMark } from "react-icons/hi2";
import AppRoutes from "./Routes";
import { useOpenAuth } from "./OAuthContext";
import { useAccount } from "./AccountContext";

const containerCs =
  `max-w-6xl mx-auto p-4 flex flex-col gap-6`;
const navbarCs =
  `bg-gray-100 p-2 rounded-lg flex flex-wrap items-center justify-between
  dark:bg-gray-800`;
const navbarLogoCs =
  `px-2 font-bold text-gray-600 text-xl
  dark:text-gray-300`;
const navbarToggleCs =
  `md:hidden inline-flex items-center justify-center px-2 h-[40px] rounded-md
  text-gray-500 hover:text-gray-600 hover:bg-gray-200
  dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700`;
const navbarContentCs = `w-full md:block md:w-auto`;
const navbarLinksCs =
  `flex flex-col md:flex-row md:ml-4 md:items-center md:justify-end`;
const navbarButtonCs =
  `flex items-center px-3 h-[40px] rounded-md text-gray-600 font-medium text-left
  hover:text-gray-900 hover:bg-gray-200
  dark:text-gray-300 dark:hover:text-gray-200 dark:hover:bg-gray-700`;

function App() {
  const auth = useOpenAuth();
  const account = useAccount();
  const [isOpen, setIsOpen] = useState(false);

  function toggleNavbar() {
    setIsOpen(!isOpen);
  }

  function handleLogout() {
    auth.logout();
    window.location.assign("/");
  }

  return account.loaded && (
    <div className={containerCs}>
      <nav className={navbarCs}>
        <Link to="/" className={navbarLogoCs}>Scratch</Link>
        <button onClick={toggleNavbar} className={navbarToggleCs}>
          {isOpen ? <HiXMark size="20" /> : <HiBars3 size="20" />}
        </button>
        <div className={`${isOpen ? "block" : "hidden"} ${navbarContentCs}`}>
          <div className={navbarLinksCs}>
            {account.userId ? (
              <>
                <Link to="/settings" className={navbarButtonCs}>
                  Settings
                </Link>
                <button className={navbarButtonCs} onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <button className={navbarButtonCs} onClick={() => auth.authorize()}>
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
      <AppRoutes />
    </div>
  );
}

export default App;
