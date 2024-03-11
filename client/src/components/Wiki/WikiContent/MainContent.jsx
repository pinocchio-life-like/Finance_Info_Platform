import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaTimes, FaChevronDown } from "react-icons/fa";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const MainContent = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeLink, setActiveLink] = useState({ left: 0, right: 0 }); // Set Link 1 and Link 3 to be selected by default
  const buttonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUrl = location.pathname;
  useEffect(() => {
    switch (currentUrl) {
      case "/wiki/articles":
        setActiveLink({ left: 0, right: 0 });
        break;
      case "/wiki/edit":
        setActiveLink({ left: 0, right: 1 });
        break;
      case "/wiki/history":
        setActiveLink({ left: 0, right: 2 });
        break;
      default:
        setActiveLink({ left: 0, right: 0 }); // default case if none of the above match
    }
  }, [currentUrl]);

  const userRole = useSelector((state) => state.user.userRole);

  const handleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  const handleLink = (side, index) => {
    setActiveLink((prevState) => ({ ...prevState, [side]: index }));
    if (side === "right") {
      switch (index) {
        case 0:
          navigate("/wiki/articles");
          break;
        case 1:
          navigate("/wiki/edit");
          break;
        case 2:
          navigate("/wiki/history");
          break;
        default:
          break;
      }
    }
  };

  const addCategory = async () => {
    const response = await api.post("/api/category/addCategory", {
      name: "Category 1",
      parent_Id: 1,
      order: 1,
      order_within_parent: 1,
    });

    console.log(response);
  };

  return (
    <div className="flex-grow flex flex-col items-center bg-white">
      <div className="flex justify-between items-center w-3/5 border-b border-gray-600 relative pt-4">
        <h1 className="text-xl font-bold">Current Title</h1>
        <button
          ref={buttonRef}
          className="flex items-center text-sm font-bold"
          onClick={() => setIsOpen(!isOpen)}>
          <div className="flex flex-col space-y-1">
            <span className="w-4 h-0.5 bg-black"></span>
            <span className="w-4 h-0.5 bg-black"></span>
            <span className="w-4 h-0.5 bg-black"></span>
          </div>
        </button>
        {isOpen && (
          <div
            className="bg-gray-100 flex flex-col space-y-2 absolute left-full p-4 ml-1 text-black"
            style={{ width: "300px", top: buttonRef.current?.offsetTop }}>
            <div className="flex justify-between items-center">
              <div className="flex justify-start items-center">
                {userRole === "admin" &&
                  activeLink.left === 0 &&
                  activeLink.right === 1 && (
                    <button className="mr-2 text-black" onClick={addCategory}>
                      <FaPlus size={12} color="#2D9596" />
                    </button>
                  )}
                <h2 className="text-lg font-bold">Contents</h2>
              </div>
              <button
                className="text-red-500 rounded-full w-6 h-6 flex items-center justify-center"
                onClick={() => setIsOpen(false)}>
                <FaTimes size={12} />
              </button>
            </div>
            {[
              "Category 1",
              "Category 2",
              "Category 3",
              "Category 4",
              "Category 5",
            ].map((link, index) => (
              <div key={index}>
                <div className="flex justify-start items-center">
                  {userRole === "admin" &&
                    activeLink.left === 0 &&
                    activeLink.right === 1 && (
                      <button className="mr-2 text-black">
                        <FaPlus size={12} color="#2D9596" />
                      </button>
                    )}
                  <a href="#" className="text-black">
                    {link}
                  </a>
                  <button
                    className="text-black rounded-full w-6 h-6 flex items-center justify-center ml-auto"
                    onClick={() => handleDropdown(index)}>
                    <FaChevronDown size={12} />
                  </button>
                </div>
                {activeDropdown === index && (
                  <div
                    className={`flex flex-col space-y-2 ${
                      userRole === "admin" &&
                      activeLink.left === 0 &&
                      activeLink.right === 1
                        ? "pl-8"
                        : "pl-4"
                    }`}>
                    <a href="#" className="text-black">
                      SubCategory 1
                    </a>
                    <a href="#" className="text-black">
                      SubCategory 2
                    </a>
                    <a href="#" className="text-black">
                      SubCategory 3
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-between items-center w-3/5 border-b border-gray-600 pb-1">
        <div>
          {["Article", "Files"].map((link, index) => (
            <a
              key={index}
              className={`p-2 cursor-pointer ${
                activeLink.left === index
                  ? "border-b-2 border-black font-bold"
                  : ""
              }`}
              style={{ lineHeight: "2rem" }}
              onClick={() => handleLink("left", index)}>
              {link}
            </a>
          ))}
        </div>
        <div>
          {["Read", "Edit", "History"].map((link, index) => (
            <a
              key={index}
              className={`p-2 cursor-pointer ${
                activeLink.right === index
                  ? "border-b-2 border-black font-bold"
                  : ""
              }`}
              style={{ lineHeight: "2rem" }}
              onClick={() => handleLink("right", index)}>
              {link}
            </a>
          ))}
        </div>
      </div>
      <div className="w-3/5">{props.children}</div>
    </div>
  );
};

export default MainContent;

MainContent.propTypes = {
  children: PropTypes.node,
};
