import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import api from "../../../utils/api";
import ReactQuill from "react-quill";
import { Button } from "antd";
import { jwtDecode } from "jwt-decode";
import { LuMinus } from "react-icons/lu";
const Answer = () => {
  const [singleQuestion, setSingleQuestion] = useState({});
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [commentVisibility, setCommentVisibility] = useState({});
  const [commentVisibilityQuestion, setCommentVisibilityQuestion] =
    useState(false);
  const [newQuestionComment, setNewQuestionComment] = useState("");
  const [newComment, setNewComment] = useState("");
  const [loadings, setLoadings] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
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
          console.log("Result", response.data.data);
          const formattedQuestion = {
            ...response.data.data,
            createdAt: format(
              parseISO(response.data.data.createdAt),
              "MMM dd, yyyy 'at' HH:mm"
            ),
            comments: response.data.data.comments.map((comment) => ({
              ...comment,
              createdAt: format(
                parseISO(comment.createdAt),
                "MMM dd, yyyy 'at' HH:mm"
              ),
            })),
            answers: response.data.data.answers.map((answer) => ({
              ...answer,
              createdAt: format(
                parseISO(answer.createdAt),
                "MMM dd, yyyy 'at' HH:mm"
              ),
              comments: answer.comments.map((comment) => ({
                ...comment,
                createdAt: format(
                  parseISO(comment.createdAt),
                  "MMM dd, yyyy 'at' HH:mm"
                ),
              })),
            })),
          };
          setSingleQuestion(formattedQuestion);
          console.log(formattedQuestion);
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

  // Question Comment

  const toggleQuestionCommentInput = () => {
    setCommentVisibilityQuestion(!commentVisibilityQuestion);
  };
  const postQuestionComment = async () => {
    if (!newQuestionComment.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userName = decodedToken.userName;
      const response = await api.post("/api/comments", {
        userName: userName,
        content: newQuestionComment,
        referred_id: id,
        referred_type: "question",
      });

      if (response.data && response.data.data) {
        setSingleQuestion((prevQuestion) => ({
          ...prevQuestion,
          comments: [...prevQuestion.comments, response.data.data],
        }));
        setNewQuestionComment("");
        document.getElementById("qc-input").value = "";
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
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
    setCommentLoading(true);
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
        document.getElementById("ac-input").value = "";
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
    finally{
      setCommentLoading(false);
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
            <p className="text-gray-700 text-sm ">
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
            <p className="text-userName text-sm text-right mb-3">
              {" "}
              Posted by: {singleQuestion.userName} | {singleQuestion.createdAt}
            </p>
          </div>
          <div className="question-comments px-8">
            <div>
              {singleQuestion.comments?.map((comment) => (
                <div
                  key={comment.comment_id}
                  className="comment flex gap-1 items-center border-b border-gray-200 py-3 px-5"
                >
                  <p className="text-commentText text-comment">
                    {comment.content}
                  </p>
                  <span>–</span>
                  <p className="text-xs text-userName">
                    {comment.userName} | {comment.createdAt}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div
            className="comment text-xs text-gray-500 cursor-pointer mt-4 px-8"
            onClick={toggleQuestionCommentInput}
          >
            Add comment
          </div>
          {commentVisibilityQuestion && (
            <div className="comment-input-area mt-2">
              <input
                type="text"
                id="qc-input"
                placeholder="Type your comment here..."
                className="border rounded p-2 w-full"
                value={newQuestionComment}
                onChange={(e) => setNewQuestionComment(e.target.value)}
              />
              <Button
                className="mt-2 qa-button semi-bold"
                onClick={postQuestionComment}
                loading={loadings[0]}
              >
                Post Comment
              </Button>
            </div>
          )}
        </div>
        <div className="all-answers">
          <div className="answers ">
            <h3 className="text-lg pb-5 font-medium">
              {singleQuestion.answers?.length} Answers
            </h3>
            {singleQuestion.answers?.map((a) => (
              <div className="mb-10 bg-gray-100 p-4 rounded-md">
                <div
                  key={a.answer_id}
                  className="mb-2 border-b border-gray-200 "
                >
                  <p className="mb-6">{a.content}</p>
                  <p className="	text-userName text-sm text-right mb-2">
                    By: {a.userName} | {a.createdAt}
                  </p>
                </div>
                <div className="px-8">
                  {a.comments?.map((c) => (
                    <div
                      key={c.comment_id}
                      className="comment flex gap-1  border-b border-gray-200 py-3 items-center "
                    >
                      <p className="text-commentText text-comment pl-3">
                        {c.content} –
                        <span className="text-xs text-userName px-1">
                          {c.userName} | {c.createdAt}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
                <div
                  className="comment text-xs text-gray-500 cursor-pointer mt-4 px-8"
                  onClick={() => toggleCommentInput(a.answer_id)}
                >
                  Add comment
                </div>
                {commentVisibility[a.answer_id] && (
                  <div className="comment-input-area mt-2">
                    <input
                      type="text"
                      id="ac-input"
                      placeholder="Type your comment here..."
                      className="border rounded p-2 w-full"
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button
                      className="mt-2 qa-button semi-bold"
                      onClick={() => postCommentAns(newComment, a.answer_id)}
                      loading={commentLoading[1]}
                    >
                      Post Comment
                    </Button>
                  </div>
                )}
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
