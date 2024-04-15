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
  const [commentVisibility, setCommentVisibility] = useState({});
  const [newComment, setNewComment] = useState("");
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
  let userName = null;
  if (token) {
    console.log("Token:", token);
    try {
      const decodedToken = jwtDecode(token);
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
            comments: []
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
  const toggleCommentInput = (answerId) => {
    setCommentVisibility((prev) => ({
      ...prev,
      [answerId]: !prev[answerId],
    }));
  };

  const postCommentAns = async (content, answerId) => {
    if (!content.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userName = decodedToken.userName;
      console.log(userName);
      const response = await api.post("/api/comments", {
        userName: userName,
        content: content,
        referred_id: answerId,
        referred_type: "answer",
      });

      if (response.data && response.data.data) {
        setAnswers((prevAnswers) =>
          prevAnswers.map((answer) => {
            if (answer.answer_id === answerId) {
              return {
                ...answer,
                comments: [...answer.comments, response.data.data],
              };
            }
            return answer;
          })
        );

        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };
  return (
    <div className="p-4 pt-8">
      <div className="question-and-answers">
        <div className="single-question mb-12 ">
          <div className="border-b mb-2 border-gray-200">
            <h2 className="font-semibold text-lg mb-2">
              {singleQuestion.question_title}
            </h2>
            <p className="text-gray-700 text-xs ">
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
            <p className="text-gray-300 text-sm text-right mb-3">
              {" "}
              Posted by: {singleQuestion.userName} | {singleQuestion.createdAt}
            </p>
          </div>
          <div className="comment text-xs text-gray-400 cursor-pointer">
            Add comment
          </div>
        </div>
        <div className="all-answers">
          <div className="answers ">
            <h3 className="text-lg pb-5 font-medium">
              {answers.length} Answers
            </h3>
            {answers.map((a) => (
              <div className="mb-4">
                <div
                  key={a.answer_id}
                  className="mb-2 border-b border-gray-200"
                >
                  <p className="mb-6">{a.content}</p>
                  <p className="	text-blue-700 text-sm text-right mb-2">
                    By: {a.userName} | {a.ansCreatedAt}
                  </p>
                </div>
                <div
                  className="comment text-xs text-gray-400 cursor-pointer"
                  onClick={() => toggleCommentInput(a.answer_id)}
                >
                  Add comment
                </div>
                {commentVisibility[a.answer_id] && (
                  <div className="comment-input-area mt-2">
                    <input
                      type="text"
                      placeholder="Type your comment here..."
                      className="border rounded p-2 w-full"
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button
                      className="mt-2 qa-button semi-bold"
                      onClick={() => postCommentAns(newComment, a.answer_id)}
                      loading={loadings[1]}
                    >
                      Post Comment
                    </Button>
                  </div>
                )}
                {a.comments &&
                  Array.isArray(a.comments) &&
                  a.comments.map((comment) => (
                    <div
                      key={comment.comment_id}
                      className="border-l-4 border-blue-500 pl-4 mb-2"
                    >
                      <p>{comment.content}</p>
                      <p className="text-xs text-gray-500">
                        {comment.userName} | {comment.createdAt}
                      </p>
                    </div>
                  ))}
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
