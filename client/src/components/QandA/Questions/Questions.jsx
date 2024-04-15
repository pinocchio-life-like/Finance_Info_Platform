import { Empty, Pagination } from "antd";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import ReactQuill from "react-quill";
const Questions = (props) => {
  const [questions, setQuestions] = useState([]);
  const [isFull, setIsFull] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const itemsPerPage = 10; // Number of questions per page

  const getQuestions = async (type) => {
    console.log("type", type);
    try {
      const response = await api.get("/api/questions");
      if (response.data && response.data.data) {
        const values = response.data.data.filter((d) => {
          return type === "all" ? d : d.count === 0;
        });

        values.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setQuestions(values);
      } else {
        console.error("Unexpected API response:", response);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    getQuestions(props.type);
  }, [props.type]);

  const getQuestionsForPage = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return questions.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    console.log("page", page);
    setCurrentPage(page);
  };

  const toggleDescription = (index) => {
    setIsFull((prev) => {
      const newIsFull = [...prev];
      newIsFull[index] = !newIsFull[index];
      return newIsFull;
    });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between w-full p-4 pt-8 pb-3">
        <h1 className="font-bold text-2xl">
          {props.type === "ununs"
            ? "Unanswered Questions"
            : "Explore Questions"}{" "}
          <span>|</span>{" "}
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
          {questions.length === 0 ? (
            <Empty className="mt-10" description="What do you have in mind!" />
          ) : (
            getQuestionsForPage().map((q, i) => {
              let matches = q.question_description.match(
                /<[^>]*>[^<]*<\/[^>]*>/g
              );
              let description = matches ? matches.slice(0, 4).join("") : "";
              return (
                <div className={i === 0 ? `pt-0` : `pt-3`} key={i}>
                  <h2 className="font-bold text-lg">
                    <Link to={`/question/${q.question_id}`}>
                      {q.question_title}
                    </Link>
                  </h2>
                  <div style={{ position: "relative" }}>
                    <ReactQuill
                      readOnly
                      value={isFull[i] ? q.question_description : description}
                      theme="bubble"
                      className="mt-auto bg-white"
                      style={{
                        marginLeft: -14,
                      }}
                    />
                    <button
                      className="text-[#008DDA]"
                      style={{ position: "absolute", bottom: 20, left: 0 }}
                      onClick={() => {
                        toggleDescription(i);
                      }}>
                      {isFull[i] ? "see less" : "...see more"}
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="inline-block bg-white rounded border border-[#008DDA] px-2 py-[0.2px] text-sm text-[#008DDA] mr-2 font-semibold">
                        {q.count} Answers
                      </span>
                      {q.Tags.map((t) => (
                        <span
                          key={t.tag_id}
                          className="inline-block bg-gray-200 rounded px-3 py-[0.2px] text-sm font-semibold text-gray-700 mr-2">
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
                  <hr className="my-2" />
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="relative flex justify-center items-end h-full pt-5">
        <Pagination
          current={currentPage}
          total={questions.length} // Total number of questions
          pageSize={itemsPerPage}
          onChange={handlePageChange} // Handle page changes
        />
      </div>
    </div>
  );
};

Questions.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Questions;
