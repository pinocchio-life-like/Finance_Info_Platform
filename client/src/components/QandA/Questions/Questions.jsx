import { Pagination } from "antd";

import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [showFullDescriptions, setShowFullDescriptions] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getQuestions = async () => {
      try {
        const response = await api.get("/api/questions");
        if (response.data && response.data.data) {
          setQuestions(response.data.data);
          setShowFullDescriptions(Array(response.data.data.length).fill(false));
        } else {
          console.error("Unexpected API response:", response);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    getQuestions();
  }, []);

  
 

  const toggleDescription = (index) => {
    setShowFullDescriptions((prevState) => {
      const updatedStates = [...prevState];
      updatedStates[index] = !updatedStates[index];
      return updatedStates;
    });
  };
  const questionIdSeter = (id) => {
    localStorage.setItem("questionId", id);
    navigate("/answer");
  };
  return (
    <div className="w-full">
      <div className="flex justify-between w-full p-4 pt-8 pb-3">
        <h1 className="font-bold text-2xl">
          Explore Questions <span>|</span>{" "}
          <span className="font-light text-xl">
            {questions.length} questions
          </span>
        </h1>
        <Link to="/ask" className="">
          <Button className="qa-button font-semibold">Ask Question</Button>
        </Link>
      </div>
      <div className="w-full p-4 pt-3">
        <div className="border-t pt-3">
          {questions.map((q, i) => (
            <div className={i === 0 ? `pt-0` : `pt-3`} key={i}>
              <h2 className="font-bold text-lg">
                <Link to={`/question/${q.question_id}`}>
                  {q.question_title}
                </Link>
              </h2>
              <p className="text-gray-700 truncate"
               style={{
                maxHeight: showFullDescriptions[i] ? "none" : "60px",
                overflow: "hidden",
                whiteSpace: "pre-line", 
                
              }}
              
              >
                {showFullDescriptions[i]
                  ? q.question_description
                  : q.question_description.trim().substring(0, 60)}
                <button
                  className="text-[#008DDA]"
                  onClick={() => toggleDescription(i)}
                >
                  {showFullDescriptions[i] ? "See Less" : "...See More"}
                </button>
              </p>
              <div className="pt-4 flex justify-between items-center">
                <div>
                  <span className="inline-block bg-white rounded border border-[#008DDA] px-2 py-[0.2px] text-sm text-[#008DDA] mr-2 font-semibold">
                    {q.count} Answers
                  </span>
                  {q.Tags.map((t) => (
                    <span
                      key={t.tag_id}
                      className="inline-block bg-gray-200 rounded px-3 py-[0.2px] text-sm font-semibold text-gray-700 mr-2"
                    >
                      {t.tag_name}
                    </span>
                  ))}
                </div>
                <div>
                  <span className="mr-2">
                    {q.userName}
                    <span className="font-semibold"> | </span>
                    {new Date(q.createdAt).toLocaleDateString("en-CA", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            // <div key={i}>
            //   {/* <Link to={`/question/${q.id}`}>{q.question_title}</Link>
            //   {q.userId && <div>{q.userId.userName}</div>} */}
            //   <span className="inline-block ">
            //     <p
            //       onClick={() => questionIdSeter(q.question_id)}
            //       className="inline-block mr-32"
            //     >
            //       {q.question_title}
            //     </p>
            //     <p
            //       className="inline-block ml-22"
            //       style={{ fontWeight: "normal" ,marginLeft: '300px'}}
            //     >
            //       asked by {q.user.userName} |{" "}
            //       {new Date(q.createdAt).toLocaleDateString()}
            //     </p>
            //   </span>
            // </div>
          ))}
        </div>
      </div>

      <div className="relative flex justify-center items-end h-full pt-5">
        <Pagination
          total={50}
          itemRender={(_, type, originalElement) => {
            if (type === "prev") {
              return <a>Prev</a>;
            }
            if (type === "next") {
              return <a>Next</a>;
            }
            return originalElement;
          }}
        />
      </div>
    </div>
  );
};

export default Questions;
