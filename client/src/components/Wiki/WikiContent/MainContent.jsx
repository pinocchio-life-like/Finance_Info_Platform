import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaTimes, FaChevronDown } from "react-icons/fa";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

const MainContent = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeLink, setActiveLink] = useState({ left: 0, right: 0 }); // Set Link 1 and Link 3 to be selected by default
  const buttonRef = useRef(null);
  const location = useLocation();
  const currentUrl = location.pathname;
  console.log(currentUrl);

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
              <h2 className="text-lg font-bold">Contents</h2>
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
              href="#"
              className={`p-2 ${
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
              href="#"
              className={`p-2 ${
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
