import React, { useState } from "react";
import { RxDotFilled } from "react-icons/rx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { PoweroffOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import "./AskQuestion.css";

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loadings, setLoadings] = useState([]);
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
  const handleInputChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const questionData = {
      title,
      description,
    };

    console.log(questionData);
  };
  return (
    <div className="p-8">
      <div className="question-tips bg-gray-200 p-6 rounded-3xl mb-6">
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
        <form onSubmit={handleSubmit}  className="flex flex-col space-y-4">
          <div>
           
            <input
              type="text" 
              className="questionTitle border w-full  p-3" //rounded-md
              name="title"
              value={title}
              placeholder="Title"
              onChange={handleInputChange}
              required
            />
          </div>
          <div >
           
            <ReactQuill
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Describe your question here"
              className="rounded-md  bg-white "
              // modules={{
              //   toolbar: [
              //     [{ 'header': '1'}, {'header': '2'}],
              //     ['bold', 'italic', 'underline', 'blockquote'],
              //     [{'list': 'ordered'}, {'list': 'bullet'}],
              //     ['link', 'image'],
              //     ['clean']
              //   ]
              // }}
            />
          </div>
          <div>
            <Button
              //type="primary"
              // icon={<PoweroffOutlined />}
              className="post-question"
              loading={loadings[1]}
              onClick={() => enterLoading(1)}
            >
              Post Question
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;
