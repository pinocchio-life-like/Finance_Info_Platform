import { useState } from "react";
import { Link } from "react-router-dom";
import { IoMdPricetags } from "react-icons/io";
import { RiQuestionAnswerFill } from "react-icons/ri";
import { RiQuestionnaireFill } from "react-icons/ri";
const Tasks = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <nav className="bg-[#D6D6D6] z-50 py-2">
        <ul className="flex flex-row items-center justify-between px-1 space-x-2 text-m">
          <li>
            <Link
              // to="/qa/questions/all"
              className={`flex items-center px-2 rounded hover:bg-gray-200 font-light ${
                activeIndex === 0 ? "text-[#155CA2] " : ""
              }`}
              onClick={() => {
                setActiveIndex(0);
              }}>
              <RiQuestionAnswerFill size={21} style={{ marginRight: 10 }} />{" "}
              Pending
            </Link>
          </li>
          <li>
            <Link
              // to="/qa/tags"
              className={`flex items-center px-2 rounded hover:bg-gray-200 font-light ${
                activeIndex === 1 ? "text-[#155CA2] " : ""
              }`}
              onClick={() => {
                setActiveIndex(1);
              }}>
              <IoMdPricetags size={21} style={{ marginRight: 10 }} />
              Completed
            </Link>
          </li>
          <li>
            <Link
              // to="/qa/questions/ununs"
              className={`flex items-center px-2 rounded hover:bg-gray-200 font-light ${
                activeIndex === 2 ? "text-[#155CA2] " : ""
              }`}
              onClick={() => {
                setActiveIndex(2);
              }}>
              <RiQuestionnaireFill size={20} style={{ marginRight: 10 }} />{" "}
              Overdue
            </Link>
          </li>
        </ul>
      </nav>
      <div
        style={{
          height: "84vh",
          overflowY: "auto",
          scrollbarWidth: "none" /* For Firefox */,
          msOverflowStyle: "none" /* For Internet Explorer and Edge */,
        }}>
        <div
          className="w-full p-2 border border-gray-400 mb-2"
          style={{
            position: "relative",
            background: "",
          }}>
          <div className="w-full flex-row">
            <p className="w-full flex border-b pb-1 border-gray-400 text-sm">
              hello
            </p>
            <p className="w-full text-sm">
              Blum auto bot free download for windows / blum auto farm bot Hi
              everyone today we present you our bot for crypto game Blum with
              which you can automate the whole process in the game which is
              possible blum farm bot / blum auto farm / blum python bot / free
              farm blum / blum telegram auto bot / blum tg bot / blum auto bot
              free
            </p>
            <div>hello</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tasks;
