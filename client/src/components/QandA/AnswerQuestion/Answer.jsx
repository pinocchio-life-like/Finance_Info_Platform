import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import api from "../../../utils/api";
import ReactQuill from "react-quill";
import { Button } from "antd";
import { jwtDecode } from "jwt-decode";
const Answer = () => {
  const [singleQuestion, setSingleQuestion] = useState({});
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [loadings, setLoadings] = useState([]);
  const { id } = useParams();

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 6000);
  };
  // Fetch The Question by ID
  useEffect(() => {
    const getSingleQuestion = async () => {
      try {
        const response = await api.get(`/api/questions/${id}`);
        if (response.data && response.data.data) {
          const formattedQuestion = {
            ...response.data.data,
            createdAt: format(
              parseISO(response.data.data.createdAt),
              "MMM dd, yyyy 'at' HH:mm"
            ),
          };
          setSingleQuestion(formattedQuestion);
        } else {
          console.log("Error while fetching single question");
        }
      } catch (error) {
        console.error("Error fetching question detail:", error);
      }
    };
    getSingleQuestion();
  }, [id]);

  const token = localStorage.getItem("token");
  //let userName = null;
  let userId = null;
  if (token) {
    // console.log("Token:", token);
    try {
      const decodedToken = jwtDecode(token);
      // console.log("Decoded Token:", decodedToken);
      //userName = decodedToken.userName;
      userId = decodedToken.userId;
      // console.log("User ID:", userId);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
  // Fetch All Answers

  // useEffect(() => {
  //   const fetchAnsers = async () => {
  //     try {
  //       const response = await api.get(`/api/answers/${id}`);
  //       if (response.data && response.data.data) {
  //         setAnswers(response.data.data);
  //       } else {
  //         console.log("Error while fetching all answers");
  //       }
  //     } catch (error) {
  //       console.log("Error fetching all ansers", error);
  //     }
  //   };
  //   //getSingleQuestion();
  //   fetchAnsers();
  // });

  // Post Answer
  const handleSubmitAnswer = async (event) => {
    event.preventDefault();
    if (!userId) {
      console.error("User ID is required");
      return;
  }
    const response = await api.post("/api/answers", {
      content: answer,
      question_id: id,
      userId,
    });
    setAnswer("");
    const answersResponse = await api.get(`/api/answers/${id}`);
    if (answersResponse.data && answersResponse.data.data) {
      setAnswers(answersResponse.data.data);
    } else {
      console.log("Error while fetching all answers");
    }
  };
  return (
    <div className="p-4 pt-8">
      <div className="question-and-answers">
        <div className="single-question">
          <h2 className="font-semibold text-lg mb-2">
            {singleQuestion.question_title}
          </h2>
          <p className="text-gray-700 text-sm">
            {singleQuestion.question_description}
          </p>
          <div className="tags mt-6">
            {singleQuestion.Tags?.map((tag) => (
              <span
                key={tag.tag_id}
                className="inline-block bg-gray-200 rounded px-3 py-1 text-xs font-normal text-gray-700 mr-2 mb-2"
              >
                {tag.tag_name}
              </span>
            ))}
          </div>
          <p className="text-gray-300 text-sm text-right">
            {" "}
            Posted by: {singleQuestion.userName} | {singleQuestion.createdAt}
          </p>
        </div>
        <div className="all-answers">
          <div className="answers">
            <h3 className="text-2xl pb-5">Answers</h3>
            {answers.map((a) => (
              <div key={a.answer_id} className="mb-4">
                <p>{a.content}</p>
                <p>Answered by: {a.userName}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="post-answer">
          <div className="answers mt-12">
            <h3 className="text-2xl pb-5">Your Answer</h3>
          </div>
          <form
            onSubmit={handleSubmitAnswer}
            className="flex flex-col space-y-4 gap-4"
          >
            <div className="">
              <ReactQuill
                value={answer}
                onChange={setAnswer}
                placeholder="Add your answer here"
                className="rounded-md  bg-white  "
              />
            </div>{" "}
            <div>
              <Button
                className="qa-button semi-bold"
                loading={loadings[1]}
                onClick={() => enterLoading(1)}
                htmlType="submit"
              >
                Post Answer
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Answer;
