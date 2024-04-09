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
  let userName = null;
  if (token) {
    console.log("Token:", token);
    try {
      const decodedToken = jwtDecode(token);
      // console.log("Decoded Token:", decodedToken);
      //userName = decodedToken.userName;
      userName = decodedToken.userName;
      console.log("User Name:", userName);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
  // Fetch All Answers

  useEffect(() => {
    const fetchAnsers = async () => {
      try {
        const ansRresponse = await api.get(`/api/answers/${id}`);
        console.log(ansRresponse);
        if (ansRresponse.data && ansRresponse.data.data) {
          const formattedAnswers = ansRresponse.data.data.map((answer) => ({
            ...answer,
            ansCreatedAt: format(
              parseISO(answer.createdAt),
              "MMM dd, yyyy 'at' HH:mm"
            ),
          }));
          setAnswers(formattedAnswers);
        } else {
          console.log("Error while fetching all answers");
        }
      } catch (error) {
        console.log("Error fetching all ansers", error);
      }
    };
    //getSingleQuestion();
    fetchAnsers();
  }, [id]);

  // Post Answer
  const handleSubmitAnswer = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found.");
      return;
    }
    const decodedToken = jwtDecode(token);
    const userName = decodedToken.userName;
    const cleanAnswer = answer.replace(/<[^>]*>/g, "");
    if (!userName) {
      console.error("User ID is required");
      return;
    }
    const response = await api.post("/api/answers", {
      content: cleanAnswer,
      question_id: id,
      userName: userName,
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
        <div className="single-question mb-12">
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
          <div className="answers ">
            <h3 className="text-lg pb-5 font-medium">
              {answers.length} Answers
            </h3>
            {answers.map((a) => (
              <div className="mb-4">
                <div key={a.answer_id} className="mb-3 border-b">
                  <p className="mb-6">{a.content}</p>
                  <p className="	text-blue-700 text-sm text-right mb-2">
                    By: {a.userName} | {a.ansCreatedAt}
                  </p>
                </div>
                <div className="comment text-sm text-gray-400">Add comment</div>
              </div>
              
            ))}
          </div>
        </div>
        <div className="post-answer">
          <div className="answers mt-12">
            <h3 className="text-lg pb-5 font-medium">Your Answer</h3>
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
