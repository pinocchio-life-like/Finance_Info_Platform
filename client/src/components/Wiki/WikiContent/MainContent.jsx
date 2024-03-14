import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";

const MainContent = (props) => {
  const [activeLink, setActiveLink] = useState({ left: 0, right: 0 }); // Set article and read to be selected by default
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
        setActiveLink({ left: 0, right: 0 }); // default case
    }
  }, [currentUrl]);

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

  return (
    <div className="flex-grow flex flex-col items-center bg-white mt-1">
      <div className="flex justify-between items-center w-3/4 border-b border-gray-600 pb-1">
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
      <div className="w-3/4">{props.children}</div>
    </div>
  );
};

export default MainContent;

MainContent.propTypes = {
  children: PropTypes.node,
};
