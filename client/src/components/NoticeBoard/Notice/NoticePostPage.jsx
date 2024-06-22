import { useState } from "react";
import { RxDotFilled } from "react-icons/rx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "antd";
import api from "../../../utils/api";
import {jwtDecode } from "jwt-decode";
import { Input, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

const NoticePostPage = () => {
    const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loadings, setLoadings] = useState([]);
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("");
 
//   const[companyName,setCompanyName]=useState([])
 
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
//   console.log(token)

  let userName = null;
  if (token) {
    // console.log("Token:", token);
    try {
      const decodedToken = jwtDecode(token);
    //   console.log("Decoded Token:", decodedToken);
      userName = decodedToken.userName;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
//   console.log(userId)
//   console.log(inputValue)
  const handleSubmit = async (event) => {
    event.preventDefault();

    const Data = {
      noticeTitle: title,
      noticeDescription: description,
      company_Name:inputValue,
     userName,

    };

const response = await api.post("/api/notice", Data);
    console.log(response.data);
    if (response && response.data) {
      setTitle("");
      setDescription("");
      setInputValue("");
   
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
 
  };
  
  
  return (
    <div className="md:px-8  md:py-8 px-1 py-7">
      <div className="question-tips bg-gray-200 p-2 md:p-6 rounded mb-2 md:mb-6">
        <h2 className="text-xl md:text-2xl font-semibold pb-4">
    Here is the notice posting page
        </h2>
        
      </div>
      <div className="pt-4">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 gap-4">
          <div>
            <input
              type="text"
              className=" border w-full  p-3" //rounded-md
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
            //   onBlur={handleInputConfirm}
              onKeyDown={handleInputChange} // Handle keydown event
              placeholder="enter company"
            />
            
          </div>
          <div>
            <Button
              className="qa-button semi-bold"
              loading={loadings[1]}
              onClick={() => enterLoading(1)}
              htmlType="submit">
              Post notice
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NoticePostPage