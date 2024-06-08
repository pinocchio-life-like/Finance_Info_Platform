import { useEffect, useRef, useState } from "react";
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



const NavBar = () => {
  const { logout } = useAuth();
  const [menuActive, setMenuActive] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [toggle, setToggle] = useState(false);
  const token = localStorage.getItem("token");
  // const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [questions, setQuestions] = useState([]);

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
      const response = await api.get("/api/category/getCategories");

      const subCategories = response.data.filter(
        (category) => category.parent_Id !== null
      );
      subCategories.sort(
        (a, b) => a.order_within_parent - b.order_within_parent
      );

      // const articles = subCategories.map((subCategory) => ({
      //   label: subCategory.category,
      //   value: subCategory.category_Id,
      // }));

      // setArticles(articles);

      const allArticles = await api.get("/api/articles");
      const all = allArticles.data.data;

      const articlesAll = all.map((value) => ({
        label: value.articleTitle,
        value: value.category_Id,
        articleContent: value.articleContent,
      }));

      setAllArticles(articlesAll);

      const forSearch = await api.get("/api/questions");
      const values = forSearch.data.data;

      const questions = values.map((value) => ({
        label: value.question_title,
        value: value.question_id,
      }));

      setQuestions(questions);

      const firstArticle = await api.get("/api/articles/first");
      setCategoryId(firstArticle.data.data);
    };

    getFirstArticle();
  }, []);

  const [search, setSearch] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const searchRef = useRef();

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setShowOptions(true);
  };

  const handleOptionClick = (option) => {
    setSearch(option);
    setShowOptions(false);
  };

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="nav-bar-container bg-nav-bg lg:px-12 px-2 h-14 lg:h-20 flex flex-col lg:flex-row">
      <div className="nav flex justify-between w-full h-full items-center">
        <div className=" flex items-center">
          <Link
            to={`/wiki/articles/${categoryId}`}
            className="flex items-center lg:gap-1 gap-2">
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
              }`}>
              Wiki
            </Link>
          </li>
          <li>
            <Link
              to="/ftp/home"
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
              to="/qa/questions/all"
              className={`font-semibold hover:text-blue-700 ${
                location.pathname.includes("qa")
                  ? "text-blue-800"
                  : "text-black"
              }`}>
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
                }`}>
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
                <div
                  className="flex w-full mx-2 rounded bg-white h-full relative"
                  ref={searchRef}>
                  <div className="relative w-full">
                    <input
                      className="w-full border-none bg-transparent px-4 py-2 items-center text-gray-400 outline-none focus:outline-none pl-10"
                      type="search"
                      name="search"
                      placeholder="Search..."
                      value={search}
                      onChange={handleSearchChange}
                    />
                    <CiSearch
                      size={26}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray"
                    />
                    {showOptions && (
                      <div
                        className="absolute w-full z-50 bg-white border border-gray-200 rounded mt-1 overflow-y-auto"
                        style={{ maxHeight: "80vh" }}>
                        <div className="px-4 py-2 font-bold">Articles</div>
                        {allArticles
                          .filter(
                            (article) =>
                              article.label
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                              (article.articleContent &&
                                article.articleContent
                                  .toLowerCase()
                                  .includes(search.toLowerCase()))
                          )
                          .map((article, index) => (
                            <Link
                              key={index}
                              to={`/wiki/articles/${article.value}`}
                              onClick={() => handleOptionClick(article.label)}
                              className="block px-4 py-2 hover:bg-gray-200 cursor-pointer">
                              {article.label}
                            </Link>
                          ))}
                        <div className="px-4 py-2 font-bold">Questions</div>
                        {questions
                          .filter((question) =>
                            question.label
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          )
                          .map((question, index) => (
                            <Link
                              key={index}
                              to={`/question/${question.value}`}
                              onClick={() => handleOptionClick(question.label)}
                              className="block px-4 py-2 hover:bg-gray-200 cursor-pointer">
                              {question.label}
                            </Link>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex relative">
              <button
                id="dropdownInformationButton"
                data-dropdown-toggle="dropdownInformation"
                className="lg:h-10 h-9 text-white bg-gray-100 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:bg-gray-400 font-medium rounded text-sm  lg:px-5 px-2 text-center inline-flex items-center "
                type="button"
                onClick={toggleMenu}>
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
          <button
            className="lg:hidden flex items-center ml-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-9 w-9">
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
                className="fixed z-50 inset-0 lg:hidden bg-black opacity-70"
                onClick={() => setIsMobileMenuOpen(false)}></div>
              <div className="fixed top-0 right-0 h-full w-56 bg-nav-bg z-50 shadow-lg lg:hidden">
                <button
                  className="p-4 text-red-500 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}>
                  Close
                </button>
                {/* Add your drawer content here */}
                <hr className="mx-2" />
                <ul
                  className="flex flex-col gap-2 my-4"
                  onClick={() => setIsMobileMenuOpen(false)}>
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
                      }`}>
                      Wiki
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/ftp/home"
                      className={`block py-2 text-black hover:bg-blue-500 hover:text-white font-semibold px-4 ${
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
                      className={`block py-2 text-black hover:bg-blue-500 hover:text-white font-semibold px-4 ${
                        location.pathname.includes("notice")
                          ? "text-blue-800"
                          : "text-black"
                      }`}>
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
                      }`}>
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
                        }`}>
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
                    }`}>
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
                    }`}>
                    Help
                  </Link>
                  <Link
                    onClick={async () => {
                      await logout();
                    }}
                    to="#"
                    className="font-semibold block px-4 py-2 text-black hover:bg-blue-500 hover:text-white">
                    Logout
                  </Link>
                </ul>
                <hr className="mx-2" />
              </div>
            </>
          )}
        </div>
        
      </div>
    </nav>
  );
};

export default NavBar;
