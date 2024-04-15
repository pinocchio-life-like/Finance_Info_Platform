import React, { useState } from "react";
import zhihu from "../../../assets/Svgs/zhihu-svgrepo-com.svg";
import { IoMdPricetags } from "react-icons/io";
import { RiQuestionAnswerFill } from "react-icons/ri";
import { RiQuestionnaireFill } from "react-icons/ri";
import "./checkboxStyle.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const QandACommon = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [type, setType] = useState("all");

  const typeToggler = (typ) => {
    setType(typ);
  };

  return (
    <div className="flex-grow flex justify-center px-14 flex-col items-center bg-white">
      <div className="flex w-3/4 justify-between items-center border-b border-gray-600 relative pt-4 pb-2">
        <div className="flex justify-start items-center">
          <img className="w-10 h-10" src={zhihu} alt="My Icon" />{" "}
          <h1 className="ml-3 text-3xl font-bold">知乎 | Q and A</h1>{" "}
        </div>
      </div>
      <div className="flex w-3/4 justify-center items-center relative border-x pb-2">
        <div className="flex w-full justify-center">
          <div className="w-1/5 h-screen sticky top-0 border-r">
            <nav className="pt-8">
              <ul className="space-y-2 text-m ">
                <li>
                  <Link
                    to="/qa/questions"
                    className={`flex items-center py-1 px-4 rounded hover:bg-gray-200 font-light ${
                      activeIndex === 0 // ? "bg-[#ababab] font-bold"
                        ? // : "bg-[#f1f2f3]  hover:bg-gray-200 font-light"
                          "text-[#008DDA] "
                        : ""
                    }`}
                    onClick={() => {
                      setActiveIndex(0);
                      typeToggler("all");
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
                    className={`flex items-center py-1 px-4 rounded hover:bg-gray-200 font-light ${
                      activeIndex === 1 // ? "bg-[#ababab] font-bold"
                        ? // : "bg-[#f1f2f3]  hover:bg-gray-200 font-light"
                          "text-[#008DDA] "
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
                    to="/qa/questions"
                    className={`flex items-center py-1 px-4 rounded hover:bg-gray-200 font-light ${
                      activeIndex === 2 // ? "bg-[#ababab] font-bold"
                        ? // : "bg-[#f1f2f3]  hover:bg-gray-200 font-light"
                          "text-[#008DDA] "
                        : ""
                    }`}
                    onClick={() => {
                      setActiveIndex(2);
                      typeToggler("ununs");
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
          <div className="w-full bg-white">
            {React.Children.map(props.children, (child) =>
              React.cloneElement(child, { type: type })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

QandACommon.propTypes = {
  children: PropTypes.node,
};

export default QandACommon;
