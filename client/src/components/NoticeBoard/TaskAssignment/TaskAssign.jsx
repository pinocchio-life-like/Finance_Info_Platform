import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../../../utils/api";
import { jwtDecode } from "jwt-decode";
import { DatePicker, Button, Select, Space } from "antd";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DOMPurify from "dompurify";
dayjs.extend(customParseFormat);
const dateFormat = "YYYY-MM-DD";


const TaskAssign = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loadings, setLoadings] = useState([]);
  const navigate = useNavigate();
  const [status, setStatus] = useState("Pending");
  const [options, setOptions] = useState([]);
 const [deadline, setDeadline] = useState(dayjs("2019-09-03", dateFormat));
 const[userId,setUserId]=useState()

  // console.log(deadline);

  // console.log(options);

  //   const[companyName,setCompanyName]=useState([])
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users/getall");
        const users = response.data.data.map((user) => ({
          value: user.userId,
          label: user.userName,
        }));
        setOptions(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);
  const handleChange = (value) => {
    console.log(`Selected: ${value}`);
    setUserId(value)
  };
  const stripHtml = (html) => {
    const cleanHtml = DOMPurify.sanitize(html);
    return cleanHtml.replace(/<[^>]*>/g, '');
  };


  const handleDateChange = (date) => {
    setDeadline(date);
  };

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
    // console.log(value);
    // console.log(value);
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
    // console.log(inputValue)
  const handleSubmit = async (event) => {
    event.preventDefault();

    const Data = {
      task_name: title,
      task_description: stripHtml(description),
      task_status: status,
      task_due_date:deadline.format(),
      userId,
    };

    try {
      const response = await api.post("/api/task", Data);
      console.log(response.data.data);
      if (response && response.data) {
        console.log('Task assigned successfully!');
        setTitle("");
        setDescription("");
        setOptions([]);
        setDeadline(dayjs());
      }
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  }

 return (
    <div className="md:px-8  md:py-8 px-1 py-7">
      <div className="question-tips bg-gray-200 p-2 md:p-6 rounded mb-2 md:mb-6">
        <h2 className="text-xl md:text-2xl font-semibold pb-4">
          Here !! you can Assign task for any one you want
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
            <Space
              className="flex my-5"
              direction="vertical"
              style={{
                width: "50%",
              }}
            >
              <Select
                mode="multiple"
                placeholder="Please select"
                // defaultValue={["a10", "c12"]}
                onChange={handleChange}
                style={{
                  width: "100%",
                }}
                options={options}
              />
            </Space>
            <DatePicker
              value={deadline}
              format={dateFormat}
              onChange={handleDateChange}
            />
          </div>
          <div>
            <Button
              className="qa-button semi-bold float-right"
              loading={loadings[1]}
              onClick={() => enterLoading(1)}
              htmlType="submit"
            >
              Assign Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskAssign;

