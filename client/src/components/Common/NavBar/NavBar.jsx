import React from "react";
import logo from "../../../assets/Images/wihLogo.png";
import { BsBellFill } from "react-icons/bs";
import { IoLanguageOutline } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { GoChevronDown } from "react-icons/go";

const NavBar = () => {
  return (
    <div className="nav-bar-container bg-nav-bg px-10  h-20">
      <div className="nav flex justify-between w-full h-full items-center">
        <div className="logo flex items-center gap-2 w-2/5">
          <div className="logo-img w-12">
            <img src={logo} alt="" className="w-full" />
          </div>
          <span className="font-semibold text-xl">WIH FINANCE DEPARTMENT</span>
        </div>
        <div className="nav-left flex items-center gap-10 w-3/5 justify-end h-11">
          <div className="search-input  w-2/4 h-11">
            <div className="flex items-center justify-center  h-full">
              <div className="flex w-full mx-10 rounded bg-white h-full">
                <input
                  className=" w-full border-none bg-transparent px-4 py-1 text-gray-400 outline-none focus:outline-none "
                  type="search"
                  name="search"
                  placeholder="Search..."
                />
                <button
                  type="submit"
                  className="rounded  px-4  text-gray"
                >
                  <CiSearch size={26} />
                </button>
              </div>
            </div>
          </div>
          <div className="notification">
            <BsBellFill size={26} />
          </div>
          <div className="lang">
            <IoLanguageOutline size={26} />
          </div>
          <div className="login-info">
            <button
              id="dropdownInformationButton"
              data-dropdown-toggle="dropdownInformation"
              class="text-white bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:bg-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-400 dark:hover:bg-gray-300 dark:focus:bg-gray-300"
              type="button"
            >
              <FaRegCircleUser size={26} color="#241F1F" className="mr-2" />
              <GoChevronDown size={26} color="#241F1F" />
            </button>

            <div
              id="dropdownInformation"
              class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
            >
              <div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                <div>Bonnie Green</div>
                <div class="font-medium truncate">name@flowbite.com</div>
              </div>
              <ul
                class="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownInformationButton"
              >
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Earnings
                  </a>
                </li>
              </ul>
              <div class="py-2">
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;