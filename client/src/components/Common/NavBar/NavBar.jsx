import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import logo from "../../../assets/Images/wihLogo.png";
import { BsBellFill } from "react-icons/bs";
import { IoLanguageOutline } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { GoChevronDown } from "react-icons/go";
import useAuth from "../../../hooks/useAuth";
import api from "../../../utils/api";
import { jwtDecode } from "jwt-decode";
import "./Navbar.css";
import { GrMenu } from "react-icons/gr";

const NavBar = () => {
  const { logout } = useAuth();
  const [menuActive, setMenuActive] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [toggle, setToggle] = useState(false);
  const token = localStorage.getItem("token");
  let userRole = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.userRole;
    } catch (error) {
      console.error("Invalid token");
    }
  }

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };
  const toggler = () => {
    const ele = document.getElementById("small");
    if (ele) {
      ele.classList.toggle("toggler");
    } else {
      console.error("Element with ID 'small' not found");
    }

    console.log("right");
    setToggle(!toggle);
  };

  useEffect(() => {
    const getFirstArticle = async () => {
      const response = await api.post("/api/category/getCategories");

      const mainCategories = response.data.filter(
        (category) => category.parent_Id === null
      );
      const subCategories = response.data.filter(
        (category) => category.parent_Id !== null
      );

      mainCategories.sort((a, b) => a.order - b.order);
      subCategories.sort(
        (a, b) => a.order_within_parent - b.order_within_parent
      );

      mainCategories.forEach((mainCategory) => {
        mainCategory.subCategories = subCategories.filter(
          (subCategory) => subCategory.parent_Id === mainCategory.category_Id
        );
      });

      const sortedCategories = [...mainCategories].sort(
        (a, b) => a.parent_Id - b.parent_Id
      );
      const categoryWithSmallestParentId = sortedCategories[0];

      if (categoryWithSmallestParentId) {
        const sortedSubCategories = [
          ...categoryWithSmallestParentId.subCategories,
        ].sort((a, b) => a.order_within_parent - b.order_within_parent);
        const subCategoryWithSmallestOrder = sortedSubCategories[0];
        setCategoryId(subCategoryWithSmallestOrder.category_Id);
      }
    };

    getFirstArticle();
  }, []);

  return (
    <nav className="nav-bar-container bg-nav-bg lg:px-12 px-2 h-14 lg:h-20 flex flex-col lg:flex-row">
      <div className="nav flex justify-between w-full h-full items-center">
        <div className=" flex items-center">
          <Link to="/" className="flex items-center lg:gap-1 gap-2">
            <div className="w-6 lg:w-12">
              <img src={logo} alt="" className="w-full" />
            </div>
            <span className="font-bold text-xl lg:hidden">WFD</span>
            <span className="font-bold text-xl hidden lg:block mr-2">
              WIH FINANCE DEPARTMENT
            </span>
          </Link>
        </div>
        <ul className="hidden lg:flex gap-10">
          <li>
            <Link
              to={`/wiki/articles/${categoryId}`}
              className={`font-bold hover:text-blue-700 ${
                location.pathname.includes("wiki")
                  ? "text-blue-800"
                  : "text-black"
              }`}
            >
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
              }`}
            >
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
              }`}
            >
              Notice
            </Link>
          </li>
          <li>
            <Link
              to="/qa/questions/all"
              className={`font-semibold hover:text-blue-700 ${
                location.pathname.includes("qa")
                  ? "text-blue-800"
                  : "text-black"
              }`}
            >
              Q&A
            </Link>
          </li>
          {userRole === "admin" && (
            <li>
              <Link
                to="/manage"
                className={`font-semibold hover:text-blue-700 ${
                  location.pathname.includes("Manage")
                    ? "text-blue-800"
                    : "text-black"
                }`}
              >
                Manage
              </Link>
            </li>
          )}
        </ul>

        {/* {add other menus here} */}
        <div className="flex">
          <div className="nav-left flex items-center lg:h-11 h-10 lg:mr-2 ">
            <div className="search-input lg:h-10 h-9">
              <div className="flex items-center justify-end  h-full">
                <div className="flex w-full mx-2 rounded bg-white h-full">
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
            <div className="hidden lg:flex relative">
              <button
                id="dropdownInformationButton"
                data-dropdown-toggle="dropdownInformation"
                className="lg:h-10 h-9 text-white bg-gray-100 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:bg-gray-400 font-medium rounded text-sm  lg:px-5 px-2 text-center inline-flex items-center "
                type="button"
                onClick={toggleMenu}
              >
                <FaRegCircleUser size={26} color="#241F1F" className="mr-2" />
                <GoChevronDown size={26} color="#241F1F" />
              </button>

              {menuActive && (
                <div className="hidden lg:flex flex-col menu z-50 absolute top-full right-0 bg-white shadow-md mt-1 py-2 w-48 rounded">
                  <div className="notification p-1 flex items-center px-4">
                    <BsBellFill
                      color="white"
                      className="bg-gray-800 rounded mr-2"
                      size={20}
                    />{" "}
                    notifications
                  </div>
                  <div className="lang p-1 flex items-center px-4">
                    <IoLanguageOutline
                      className="bg-gray-800 rounded mr-2"
                      color="white"
                      size={20}
                    />{" "}
                    language
                  </div>
                  <Link
                    to="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                  >
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
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                  >
                    Help
                  </Link>
                  <Link
                    onClick={async () => {
                      await logout();
                    }}
                    to="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
          <button
            className="lg:hidden flex items-center ml-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-9 w-9"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {isMobileMenuOpen && (
            <>
              <div
                className="fixed z-50 inset-0 lg:hidden bg-black opacity-70 z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              ></div>
              <div className="fixed top-0 right-0 h-full w-56 bg-nav-bg z-50 shadow-lg lg:hidden">
                <button
                  className="p-4 text-red-500 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Close
                </button>
                {/* Add your drawer content here */}
                <hr className="mx-2" />
                <ul
                  className="flex flex-col gap-2 my-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="notification p-1 flex items-center px-4">
                    <BsBellFill
                      color="white"
                      className="bg-gray-800 rounded mr-2"
                      size={20}
                    />{" "}
                    notifications
                  </div>
                  <div className="lang p-1 flex items-center px-4">
                    <IoLanguageOutline
                      className="bg-gray-800 rounded mr-2"
                      color="white"
                      size={20}
                    />{" "}
                    language
                  </div>
                  <hr className="mx-2" />
                  <li>
                    <Link
                      to={`/wiki/articles/${categoryId}`}
                      className={`block py-2 text-black hover:bg-blue-500 hover:text-white font-semibold px-4 ${
                        location.pathname.includes("wiki")
                          ? "text-blue-800"
                          : "text-black"
                      }`}
                    >
                      Wiki
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/ftp"
                      className={`block py-2 text-black hover:bg-blue-500 hover:text-white font-semibold px-4 ${
                        location.pathname.includes("ftp")
                          ? "text-blue-800"
                          : "text-black"
                      }`}
                    >
                      FTP
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/notice"
                      className={`block py-2 text-black hover:bg-blue-500 hover:text-white font-semibold px-4 ${
                        location.pathname.includes("notice")
                          ? "text-blue-800"
                          : "text-black"
                      }`}
                    >
                      Notice
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/qa/questions/all"
                      className={`block py-2 text-black hover:bg-blue-500 hover:text-white font-semibold px-4 ${
                        location.pathname.includes("qa")
                          ? "text-blue-800"
                          : "text-black"
                      }`}
                    >
                      Q&A
                    </Link>
                  </li>
                  {userRole === "admin" && (
                    <li>
                      <Link
                        to="/manage"
                        className={`block py-2 text-black hover:bg-blue-500 hover:text-white font-semibold px-4 ${
                          location.pathname.includes("Manage")
                            ? "text-blue-800"
                            : "text-black"
                        }`}
                      >
                        Manage
                      </Link>
                    </li>
                  )}
                  <hr className="mx-2" />

                  <Link
                    to="#"
                    className={`block py-2 text-black hover:bg-blue-500 hover:text-white font-semibold px-4 ${
                      location.pathname.includes("profile")
                        ? "text-blue-800"
                        : "text-black"
                    }`}
                  >
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
                    className={`block py-2 text-black hover:bg-blue-500 hover:text-white font-semibold px-4 ${
                      location.pathname.includes("help")
                        ? "text-blue-800"
                        : "text-black"
                    }`}
                  >
                    Help
                  </Link>
                  <Link
                    onClick={async () => {
                      await logout();
                    }}
                    to="#"
                    className="font-semibold block px-4 py-2 text-black hover:bg-blue-500 hover:text-white"
                  >
                    Logout
                  </Link>
                </ul>
                <hr className="mx-2" />
              </div>
            </>
          )}
        </div>
        <div className="small" id="small">
          <button onClick={toggler}>
            <GrMenu />
            {toggle && (
              // <div className="list">
              <ul className="flex gap-10 lg:ml-36 md:gap-13 sm:ml-4">
                <li>
                  <Link
                    to={`/wiki/articles/${categoryId}`}
                    className={`font-bold hover:text-blue-700 ${
                      location.pathname.includes("wiki")
                        ? "text-blue-800"
                        : "text-black"
                    }`}
                  >
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
                    }`}
                  >
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
                    }`}
                  >
                    Notice
                  </Link>
                </li>
                <li>
                  <Link
                    to="/qa/questions"
                    className={`font-semibold hover:text-blue-700 ${
                      location.pathname.includes("qa")
                        ? "text-blue-800"
                        : "text-black"
                    }`}
                  >
                    Q&A
                  </Link>
                </li>
                <li>
                  {userRole === "admin" && (
                    <li>
                      <Link
                        to="/manage"
                        className={`font-semibold hover:text-blue-700 ${
                          location.pathname.includes("Manage")
                            ? "text-blue-800"
                            : "text-black"
                        }`}
                      >
                        Manage
                      </Link>
                    </li>
                  )}
                </li>
                <li>
                  <input
                    className="w-full border-none bg-transparent px-4 py-1 
                      text-gray-400 outline-none focus:outline-none"
                    type="search"
                    name="search"
                    placeholder="Search..."
                  />
                </li>
                <li>
                  <button type="submit" className="rounded px-4 text-gray">
                    <CiSearch size={26} />
                  </button>
                </li>
                <li>
                  <BsBellFill color="gray" size={26} />
                </li>
                <li>
                  <IoLanguageOutline color="gray" size={26} />
                </li>
                {/* <li>
            <button
                  id="dropdownInformationButton"
                  data-dropdown-toggle="dropdownInformation"
                  className="text-white bg-gray-100 hover:bg-gray-300 focus:ring-4 
                  focus:outline-none focus:bg-gray-400 font-medium rounded-lg text-sm px-5 
                  py-2 text-center inline-flex items-center"
                  type="button"
                >
                  <FaRegCircleUser size={26} color="#241F1F" className="mr-2" /> 
                  <GoChevronDown size={26} color="#241F1F" />
                </button>
                
            </li>  */}

                <li>
                  <Link
                    to="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                  >
                    Help
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={async () => {
                      await logout();
                    }}
                    to="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                  >
                    Logout
                  </Link>
                </li>
              </ul>

              //  </div>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
