import { useState } from "react";
import zhihu from "../../../assets/Svgs/zhihu-svgrepo-com.svg";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { IoMdPricetags } from "react-icons/io";
import { RiQuestionAnswerFill } from "react-icons/ri";
import { RiQuestionnaireFill } from "react-icons/ri";
import { Checkbox } from "antd";
import "./checkboxStyle.css";

const QandACommon = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex-grow flex flex-col items-center bg-white">
      <div className="flex justify-between items-center w-3/5 border-b border-gray-600 relative pt-4 pb-2">
        <div className="flex justify-start items-center">
          <img className="w-10 h-10" src={zhihu} alt="My Icon" />{" "}
          <h1 className="ml-3 text-3xl font-bold">知乎</h1>{" "}
        </div>
      </div>
      <div className="flex justify-start items-center w-3/5 border-x relative pb-2">
        <div className="flex w-full">
          <div className="w-1/5 h-screen sticky top-0 border-r">
            <nav className="pt-8">
              <ul className="space-y-2 text-m ">
                <li>
                  <a
                    href="#section1"
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
                  </a>
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
                        </div>
                      </Checkbox.Group>
                    </ul>
                  )}
                </li>
                <li>
                  <a
                    href="#section3"
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
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="w-4/5 bg-white">
            <h1 className="w-full p-4 pt-8 font-bold text-2xl pb-3">
              Explore Questions
            </h1>
            <div className="w-full p-4">
              <div className="border-t pt-3">
                <h2 className="font-bold text-xl">A question title...</h2>
                <p className="text-gray-700 truncate">
                  A question description
                  <button className="text-[#008DDA]">...see more</button>
                </p>
                <div className="pt-4 flex justify-between items-center">
                  <div>
                    <span className="inline-block bg-white rounded border border-[#008DDA] px-2 py-[0.2px] text-sm text-[#008DDA] mr-2 font-semibold">
                      5 answers
                    </span>
                    <span className="inline-block bg-gray-200 rounded px-3 py-[0.2px] text-sm font-semibold text-gray-700 mr-2">
                      Tag1
                    </span>
                    <span className="inline-block bg-gray-200 rounded  py-[0.2px] px-3 text-sm font-semibold text-gray-700 mr-2">
                      Tag2
                    </span>
                    <span className="inline-block bg-gray-200 rounded  py-[0.2px] px-3 text-sm font-semibold text-gray-700">
                      Tag3
                    </span>
                  </div>
                  <div>
                    <span className="mr-2">
                      Name<span className="font-semibold"> | </span>
                      Date
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full p-4">
              <div className="border-t pt-3">
                <h2 className="font-bold text-xl">A question title...</h2>
                <p className="text-gray-700 truncate">
                  A question description
                  <button className="text-[#008DDA]">...see more</button>
                </p>
                <div className="pt-4 flex justify-between items-center">
                  <div>
                    <span className="inline-block bg-white rounded border border-[#008DDA] px-2 py-[0.2px] text-sm text-[#008DDA] mr-2 font-semibold">
                      5 answers
                    </span>
                    <span className="inline-block bg-gray-200 rounded px-3 py-[0.2px] text-sm font-semibold text-gray-700 mr-2">
                      Tag1
                    </span>
                    <span className="inline-block bg-gray-200 rounded  py-[0.2px] px-3 text-sm font-semibold text-gray-700 mr-2">
                      Tag2
                    </span>
                    <span className="inline-block bg-gray-200 rounded  py-[0.2px] px-3 text-sm font-semibold text-gray-700">
                      Tag3
                    </span>
                  </div>
                  <div>
                    <span className="mr-2">
                      Name<span className="font-semibold"> | </span>
                      Date
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QandACommon;
