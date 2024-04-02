import { useState } from "react";
import zhihu from "../../../assets/Svgs/zhihu-svgrepo-com.svg";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { IoMdPricetags } from "react-icons/io";
import { RiQuestionAnswerFill } from "react-icons/ri";
import { RiQuestionnaireFill } from "react-icons/ri";
import { Checkbox } from "antd";
import "./checkboxStyle.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const QandACommon = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex-grow w-full flex px-14 flex-col items-center bg-white">
      <div className="flex justify-between items-center w-full border-b border-gray-600 relative pt-4 pb-2">
        <div className="flex justify-start items-center">
          <img className="w-10 h-10" src={zhihu} alt="My Icon" />{" "}
          <h1 className="ml-3 text-3xl font-bold">知乎</h1>{" "}
        </div>
      </div>
      <div className="flex justify-start items-center w-full border-x relative pb-2">
        <div className="flex w-full">
          <div className="w-1/5 h-screen sticky top-0 border-r">
            <nav className="pt-8">
              <ul className="space-y-2 text-m ">
                <li>
                  <Link
                    to="/qa/questions"
                    className={`flex items-center py-1 px-4 rounded ${
                      activeIndex === 0
                        ? "bg-[#ababab] font-bold"
                        : "bg-[#f1f2f3]  hover:bg-gray-200 font-light"
                    }`}
                    onClick={() => setActiveIndex(0)}>
                    <RiQuestionAnswerFill
                      size={20}
                      style={{ marginRight: 10 }}
                    />{" "}
                    Questions
                  </Link>
                </li>
                <li className="relative group">
                  <button
                    className={`w-full flex justify-between items-center py-1 px-4 rounded ${
                      activeIndex === 1
                        ? "bg-[#ababab] font-bold"
                        : "bg-[#f1f2f3]  hover:bg-gray-200 font-light"
                    }`}
                    onClick={() => {
                      setDropdownOpen(!dropdownOpen);
                    }}>
                    <div className={`flex items-center`}>
                      <IoMdPricetags size={21} style={{ marginRight: 10 }} />{" "}
                      Tags
                    </div>
                    {dropdownOpen ? <AiOutlineUp /> : <AiOutlineDown />}
                  </button>
                  {dropdownOpen && (
                    <ul className="w-full px-1 pb-0 pt-2 space-y-1 bg- ">
                      <Checkbox.Group className="w-full">
                        <div className="bg-white w-full px-3 border border-[#ababab] border-l-[3px] border-l-[#008DDA]">
                          <div className="flex justify-between items-center py-2">
                            <Checkbox value="subsection1" className="leading-8">
                              Tag 1
                            </Checkbox>
                            <span>20</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <Checkbox value="subsection2" className="leading-8">
                              Tag 2
                            </Checkbox>
                            <span>20</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <Checkbox value="subsection3" className="leading-8">
                              Tag 3
                            </Checkbox>
                            <span>20</span>
                          </div>
                          <button className="w-full flex justify-center text-left py-2 border-t hover:bg-[#008DDA] mb-1 rounded hover:text-white text-[#008DDA]">
                            expand to see more tags
                          </button>
                        </div>
                      </Checkbox.Group>
                    </ul>
                  )}
                </li>
                <li>
                  <Link
                    to="/qa/unanswered"
                    className={`flex items-center py-1 px-4 rounded ${
                      activeIndex === 2
                        ? "bg-[#ababab] font-bold"
                        : "bg-[#f1f2f3]  hover:bg-gray-200 font-light"
                    }`}
                    onClick={() => setActiveIndex(2)}>
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
          <div className="w-full bg-white">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

QandACommon.propTypes = {
  children: PropTypes.node,
};

export default QandACommon;
