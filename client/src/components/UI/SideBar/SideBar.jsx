import { useState, useEffect } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [topPosition, setTopPosition] = useState(90);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setTopPosition(Math.max(90 - scrollPosition, 0));
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isExpanded ? "w-60" : "w-15"
      }`}
      style={{
        top: `${topPosition}px`,
        bottom: 0,
        background: "white",
        boxShadow: "2px 0px 4px 0px rgba(0, 0, 0, 0.6)",
        transition: "top 0s",
      }}>
      <div className={`content p-4 ${isExpanded ? "block" : "hidden"}`}>
        Sidebar content
      </div>
      {!isExpanded && <div className="content p-4">Icons</div>}
      <div
        className="absolute z-50 top-[30px] right-[-28px] w-7 h-8 flex items-center justify-center rounded-tr-lg rounded-br-lg"
        style={{
          backgroundColor: "white",
          color: "#001529",
          boxShadow: "1px 0px 1px 1px rgba(0, 0, 0, 0.5)",
          borderLeft: "none",
        }}>
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <FaAngleLeft /> : <FaAngleRight />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
