import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import api from "../../../utils/api";
import ReactQuill from "react-quill";
import { Button } from "antd";
import { jwtDecode } from "jwt-decode";
const Answer = () => {
  const [singleQuestion, setSingleQuestion] = useState({});
  const [answer, setAnswer] = useState("");
  const [commentVisibility, setCommentVisibility] = useState({});
  const [commentVisibilityQuestion, setCommentVisibilityQuestion] =
    useState(false);
  const [newQuestionComment, setNewQuestionComment] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const { id } = useParams();

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
        } else {
          console.log("Error while fetching single question");
        }
      } catch (error) {
        console.error("Error fetching question detail:", error);
      }
    };
    getSingleQuestion();
  }, [id, refetch]);

  // Post Answer
  const handleSubmitAnswer = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found.");
        return;
      }
      const decodedToken = jwtDecode(token);
      const userName = decodedToken.userName;
      if (!userName) {
        console.error("User ID is required");
        return;
      }
      await api.post("/api/answers", {
        content: answer,
        question_id: id,
        userName: userName,
      });
      setAnswer("");
      setRefetch((prev) => !prev);
    } catch (error) {
      console.error("An error occurred while fetching the answers:", error);
    }
    setIsLoading(false);
  };

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
        setCommentVisibilityQuestion(false);
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
      await api.post("/api/comments", {
        userName: userName,
        content: content,
        referred_id: answerId,
        referred_type: "answer",
      });
      toggleCommentInput(answerId);
      setRefetch((prev) => !prev);
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div className="p-4 pt-8">
      <div className="question-and-answers">
        <div className="single-question mb-4">
          <div className="border-b mb-2 border-gray-200">
            <h2 className="font-semibold text-lg mb-2">
              {singleQuestion.question_title}
            </h2>
            <div style={{ position: "relative" }}>
              <ReactQuill
                readOnly
                value={singleQuestion.question_description}
                theme="bubble"
                className="mt-auto bg-white"
                style={{
                  marginLeft: -14,
                }}
              />
              <div className="absolute w-full" style={{ bottom: 10, left: 0 }}>
                <div className="w-full flex items-center justify-between">
                  <div className="tags">
                    {singleQuestion.Tags?.map((tag) => (
                      <span
                        key={tag.tag_id}
                        className="inline-block bg-gray-200 rounded px-3 py-1 text-xs font-normal text-gray-700 mr-2"
                      >
                        {tag.tag_name}
                      </span>
                    ))}
                  </div>
                  <p className="text-userName text-sm text-right">
                    {" "}
                    {singleQuestion.userName} | {singleQuestion.createdAt}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="question-comments px-6">
            <div>
              {singleQuestion.comments?.map((comment) => (
                <div
                  key={comment.comment_id}
                  className="flex flex-col border-b border-gray-200 py-1"
                >
                  <ReactQuill
                    readOnly
                    value={comment.content}
                    theme="bubble"
                    className="mt-auto bg-white"
                    style={{
                      marginLeft: -14,
                      marginTop: -8,
                    }}
                  />
                  <span className="mt-[-40px] text-xs text-userName flex">
                    {comment.userName} | {comment.createdAt}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="comment text-xs text-gray-500 cursor-pointer my-5 px-6"
            onClick={toggleQuestionCommentInput}
          >
            Add comment
          </div>
          {commentVisibilityQuestion && (
            <div className="comment-input-area px-5">
              <ReactQuill
                value={newQuestionComment}
                theme="snow"
                onChange={setNewQuestionComment}
                placeholder="Add your answer here"
                className="rounded-md  bg-white"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "blockquote"],
                    [
                      { list: "ordered" },
                      { list: "bullet" },
                      { indent: "-1" },
                      { indent: "+1" },
                    ],
                    [
                      "link",
                      "image",
                      // "video"
                    ],
                    ["clean"],
                  ],
                }}
                formats={[
                  "header",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "blockquote",
                  "list",
                  "bullet",
                  "indent",
                  "link",
                  "image",
                  // "video",
                ]}
              />
              <Button
                className="mt-2 qa-button semi-bold"
                onClick={postQuestionComment}
                loading={commentLoading}
              >
                Post Comment
              </Button>
            </div>
          )}
        </div>
        <div className="all-answers">
          <div className="answers ">
            <h3 className="text-lg font-medium py-2">
              {singleQuestion.answers?.length} Answers
            </h3>
            {singleQuestion.answers?.map((a) => (
              <div key={a.answer_id} className="px-4 rounded-sm mt-2">
                <div className="">
                  <div key={a.answer_id} className=" border-t">
                    <ReactQuill
                      readOnly
                      value={a.content}
                      theme="bubble"
                      className="block mt-auto bg-white"
                      style={{
                        marginLeft: -14,
                        marginBottom: -45,
                      }}
                    />
                    <p className="text-xs text-userName pb-2 border-b">
                      {a.userName} | {a.createdAt}
                    </p>
                  </div>
                  <div className="px-4">
                    {a.comments?.map((c) => (
                      <div
                        key={c.comment_id}
                        className="comment flex flex-col gap-1  border-b border-gray-200 py-3"
                      >
                        <ReactQuill
                          readOnly
                          value={c.content}
                          theme="bubble"
                          className="mt-auto bg-white"
                          style={{
                            marginLeft: -14,
                            marginTop: -8,
                          }}
                        />
                        <span className="mt-[-40px] text-xs text-userName">
                          {c.userName} | {c.createdAt}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    className="comment text-xs text-gray-500 cursor-pointer p-4"
                    onClick={() => toggleCommentInput(a.answer_id)}
                  >
                    Add comment
                  </div>
                  {commentVisibility[a.answer_id] && (
                    <div className="comment-input-area mt-2">
                      <ReactQuill
                        value={newComment}
                        theme="snow"
                        onChange={setNewComment}
                        placeholder="Add your answer here"
                        className="rounded-md  bg-white"
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, false] }],
                            ["bold", "italic", "underline", "blockquote"],
                            [
                              { list: "ordered" },
                              { list: "bullet" },
                              { indent: "-1" },
                              { indent: "+1" },
                            ],
                            [
                              "link",
                              "image",
                              // "video"
                            ],
                            ["clean"],
                          ],
                        }}
                        formats={[
                          "header",
                          "bold",
                          "italic",
                          "underline",
                          "strike",
                          "blockquote",
                          "list",
                          "bullet",
                          "indent",
                          "link",
                          "image",
                          // "video",
                        ]}
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
              </div>
            ))}
          </div>
        </div>
        <div className="post-answer border-t mt-6">
          <div className="answers ">
            <h3 className="text-lg py-4 font-medium">Your Answer</h3>
          </div>
          <form
            onSubmit={handleSubmitAnswer}
            className="flex flex-col space-y-4 gap-4"
          >
            <div className="">
              <ReactQuill
                value={answer}
                theme="snow"
                onChange={setAnswer}
                placeholder="Add your answer here"
                className="rounded-md  bg-white"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "blockquote"],
                    [
                      { list: "ordered" },
                      { list: "bullet" },
                      { indent: "-1" },
                      { indent: "+1" },
                    ],
                    [
                      "link",
                      "image",
                      // "video"
                    ],
                    ["clean"],
                  ],
                }}
                formats={[
                  "header",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "blockquote",
                  "list",
                  "bullet",
                  "indent",
                  "link",
                  "image",
                  // "video",
                ]}
              />
            </div>{" "}
            <div>
              <Button
                className="qa-button semi-bold"
                loading={isLoading}
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
