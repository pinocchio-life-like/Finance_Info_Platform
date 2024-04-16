import { useState } from "react";
import zhihu from "../../../assets/Svgs/zhihu-svgrepo-com.svg";
import { IoMdPricetags } from "react-icons/io";
import { RiQuestionAnswerFill } from "react-icons/ri";
import { RiQuestionnaireFill } from "react-icons/ri";
import "./checkboxStyle.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const QandACommon = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  // const [type, setType] = useState("all");

  // const typeToggler = (typ) => {
  //   setType(typ);
  // };

  return (
    <div className="flex justify-center lg:px-14 px-1 flex-col bg-white">
      <div className="flex w-full justify-between items-center border-b border-gray-600 relative md:pt-4 pt-2 pb-2">
        <div className="flex justify-start items-center">
          <img className="w-8 h-8 md:w-10 md:h-10" src={zhihu} alt="My Icon" />{" "}
          <h1 className="ml-2 md:ml-3 text-2xl md:text-3xl font-bold">
            知乎 | Q and A
          </h1>{" "}
        </div>
      </div>
      <div className="flex w-full justify-center items-center relative border-x pb-2">
        <div className="w-full flex flex-col md:flex-row md:justify-center">
          <div className="md:min-w-1/5 md:h-screen h-4 sticky top-0 border-r z-50">
            <nav className="min-w-1 md:pt-8 pt-2 md:pb-0 pb-2 md:bg-white bg-[#D6D6D6] z-50">
              <ul className="min-w-1 flex flex-row md:items-start items-center md:justify-start justify-between md:px-0 px-1 space-x-2 text-m sm:space-y-2 md:flex-col sm:space-x-0">
                <li>
                  <Link
                    to="/qa/questions/all"
                    className={`flex items-center py-1 md:px-4 px-2 rounded hover:bg-gray-200 font-light ${
                      activeIndex === 0 // ? "bg-[#ababab] font-bold"
                        ? // : "bg-[#f1f2f3]  hover:bg-gray-200 font-light"
                          "text-[#155CA2] "
                        : ""
                    }`}
                    onClick={() => {
                      setActiveIndex(0);
                      // typeToggler("all");
                    }}>
                    <RiQuestionAnswerFill
                      size={20}
                      style={{ marginRight: 10 }}
                    />{" "}
                    Questions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/qa/tags"
                    className={`flex items-center py-1 md:px-4 px-2 rounded hover:bg-gray-200 font-light ${
                      activeIndex === 1 // ? "bg-[#ababab] font-bold"
                        ? // : "bg-[#f1f2f3]  hover:bg-gray-200 font-light"
                          "text-[#155CA2] "
                        : ""
                    }`}
                    onClick={() => {
                      setActiveIndex(1);
                    }}>
                    <IoMdPricetags size={21} style={{ marginRight: 10 }} />
                    Tags
                  </Link>
                </li>
                <li>
                  <Link
                    to="/qa/questions/ununs"
                    className={`flex items-center py-1 md:px-4 px-2 rounded hover:bg-gray-200 font-light ${
                      activeIndex === 2 // ? "bg-[#ababab] font-bold"
                        ? // : "bg-[#f1f2f3]  hover:bg-gray-200 font-light"
                          "text-[#155CA2] "
                        : ""
                    }`}
                    onClick={() => {
                      setActiveIndex(2);
                      // typeToggler("ununs");
                    }}>
                    <RiQuestionnaireFill
                      size={20}
                      style={{ marginRight: 10 }}
                    />{" "}
                    Unanswered
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="w-full bg-white md:mt-0 mt-2">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

QandACommon.propTypes = {
  children: PropTypes.node,
};

export default QandACommon;
