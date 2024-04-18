import { useState } from "react";
import { RxDotFilled } from "react-icons/rx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "antd";
import api from "../../../../utils/api";
import { jwtDecode } from "jwt-decode";
import { Input, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loadings, setLoadings] = useState([]);
  const navigate = useNavigate();
  // const [tagNames,setTagNames]=useState([])
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState([]);
  // console.log(Array.isArray(tags));
  // console.log(tags)
  // console.log(title)
  // console.log(description)
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
  const handleInputChange1 = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (value) => {
    console.log(value);
    console.log(value);
    setDescription(value);
  };
  const token = localStorage.getItem("token");

  let userName = null;
  if (token) {
    // console.log("Token:", token);
    try {
      const decodedToken = jwtDecode(token);
      // console.log("Decoded Token:", decodedToken);
      userName = decodedToken.userName;
      // console.log("User ID:", userId);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const tagNames = Array.isArray(tags) ? tags : [];
    const questionData = {
      question_title: title,
      question_description: description,
      tagNames,
      userName,
    };

    console.log(questionData);

    const response = await api.post("/api/questions", questionData);
    console.log(response.data);
    if (response && response.data) {
      setTitle("");
      setDescription("");
      setTags([]);
      navigate("/qa/questions");
    }
  };

  const handleInputChange = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInputConfirm();
    } else {
      setInputValue(e.target.value);
    }
  };
  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
      setInputValue("");
    }
  };

  const handleTagClose = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
  };
  return (
    <div className="p-8">
      <div className="question-tips bg-gray-200 p-6 rounded mb-6">
        <h3 className="text-2xl font-semibold pb-4">
          Tips on getting good answers quickly
        </h3>
        <ul className="pl-6">
          <div className="flex items-center pb-2 ">
            <span>
              <RxDotFilled size={24} />
            </span>
            <li>Double-check grammar and spelling</li>
          </div>
          <div className="flex items-center  pb-2">
            <span>
              <RxDotFilled size={24} />
            </span>
            <li>Keep your question short and to the point</li>
          </div>
          <div className="flex items-center pb-2 ">
            <span>
              <RxDotFilled size={24} />
            </span>
            <li>Make sure your question has not been asked already</li>
          </div>
        </ul>
      </div>
      <div className="pt-4">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 gap-4">
          <div>
            <input
              type="text"
              className="questionTitle border w-full  p-3" //rounded-md
              name="title"
              value={title}
              placeholder="Title"
              onChange={handleInputChange1}
              required
            />
          </div>
          <div className="">
            <ReactQuill
              value={description}
              theme="snow"
              onChange={handleDescriptionChange}
              placeholder="Describe your question here"
              className="rounded-md  bg-white  "
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
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onKeyDown={handleInputChange} // Handle keydown event
              placeholder="Add a tag"
            />
            {tags.map((tag) => (
              <Tag key={tag} closable onClose={() => handleTagClose(tag)}>
                {tag}
              </Tag>
            ))}
          </div>
          <div>
            <Button
              className="qa-button semi-bold"
              loading={loadings[1]}
              onClick={() => enterLoading(1)}
              htmlType="submit">
              Post Question
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;
