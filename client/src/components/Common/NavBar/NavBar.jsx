import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import logo from "../../../assets/Images/wihLogo.png";
import { BsBellFill } from "react-icons/bs";
import { IoLanguageOutline } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { GoChevronDown } from "react-icons/go";
import useAuth from "../../../hooks/useAuth";

const NavBar = () => {
  const { logout } = useAuth();
  const [menuActive, setMenuActive] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <nav className="nav-bar-container bg-nav-bg px-12  h-20 ">
      <div className="nav flex justify-between w-full h-full items-center">
        <div className="logo flex items-center gap-2 w-3/5">
          <Link to="/" className="flex items-center gap-2">
            <div className="logo-img w-12">
              <img src={logo} alt="" className="w-full" />
            </div>
            <span className="font-bold text-xl">WIH FINANCE DEPARTMENT</span>
          </Link>
          <ul className="flex gap-10 ml-36">
            <li>
              <Link
                to="/wiki/articles/2"
                className={`font-bold hover:text-blue-700 ${
                  location.pathname.includes("wiki")
                    ? "text-blue-800"
                    : "text-black"
                }`}>
                Wiki
              </Link>
            </li>
            <li>
              <Link
                to="/ftp"
                className={`font-bold hover:text-blue-700 ${
                  location.pathname.includes("ftp")
                    ? "text-blue-800"
                    : "text-black"
                }`}>
                FTP
              </Link>
            </li>
            <li>
              <Link
                to="/notice"
                className={`font-bold hover:text-blue-700 ${
                  location.pathname.includes("notice")
                    ? "text-blue-800"
                    : "text-black"
                }`}>
                Notice
              </Link>
            </li>
            <li>
              <Link
                to="/qa"
                className={`font-semibold hover:text-blue-700 ${
                  location.pathname.includes("qa")
                    ? "text-blue-800"
                    : "text-black"
                }`}>
                Q&A
              </Link>
            </li>
            <li>
              <Link
                to="/manage"
                className={`font-semibold hover:text-blue-700 ${
                  location.pathname.includes("Manage")
                    ? "text-blue-800"
                    : "text-black"
                }`}>
                Manage
              </Link>
            </li>
          </ul>
        </div>
        {/* {add a na menu here} */}
        <div className="nav-left flex items-center gap-6 w-3/6 justify-end h-11">
          <div className="search-input  w-2/4 h-10">
            <div className="flex items-center justify-end  h-full">
              <div className="flex w-full mx-8 rounded bg-white h-full">
                <input
                  className=" w-full border-none bg-transparent px-4 py-1 text-gray-400 outline-none focus:outline-none "
                  type="search"
                  name="search"
                  placeholder="Search..."
                />
                <button type="submit" className="rounded  px-4  text-gray">
                  <CiSearch size={26} />
                </button>
              </div>
            </div>
          </div>
          <div className="notification bg-gray-800 rounded-full p-1">
            <BsBellFill color="white" size={26} />
          </div>
          <div className="lang bg-gray-800 rounded-full p-1">
            <IoLanguageOutline color="white" size={26} />
          </div>
          <div className="login-info relative">
            <button
              id="dropdownInformationButton"
              data-dropdown-toggle="dropdownInformation"
              className="text-white bg-gray-100 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:bg-gray-400 font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center "
              type="button"
              onClick={toggleMenu}>
              <FaRegCircleUser size={26} color="#241F1F" className="mr-2" />
              <GoChevronDown size={26} color="#241F1F" />
            </button>

            {menuActive && (
              <div className="menu z-50 absolute top-full right-0 bg-white shadow-md mt-1 py-2 w-48 rounded">
                <Link
                  to="#"
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white">
                  Profile
                </Link>
                {/* may be we need to set our own email app */}
                {/* <Link
                  to="#"
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white">
                  Inbox
                </Link> */}
                {/* <Link
                  to="#"
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white">
                  Manage
                </Link> */}
                {/* this is to give some articles and demo */}
                <Link
                  to="#"
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white">
                  Help
                </Link>
                <Link
                  onClick={async () => {
                    await logout();
                  }}
                  to="#"
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white">
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
