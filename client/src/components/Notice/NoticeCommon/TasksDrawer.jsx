import { Button, DatePicker, Drawer, Form, Input, Select, Space } from "antd";
import { useState } from "react";
import ReactQuill from "react-quill";
import moment from "moment";
import { jwtDecode } from "jwt-decode";
import api from "../../../utils/api";

const TasksDrawer = (props) => {
  const [taskForm] = Form.useForm();
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");
  let userName = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userName = decodedToken.userName;
    } catch (error) {
      console.error("Invalid token");
    }
  }

  const onClose = () => {
    props.setOpen(false);
  };
  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const submitHandler = async (values) => {
    try {
      const response = await api.post("/api/task", {
        task_name: values.taskTitle,
        task_description: description,
        users: values.users,
        task_due_date: values.endDate,
        userName: userName,
      });

      // Check if the response is successful (status code 200-299)
      if (response.status >= 200 && response.status < 300) {
        // Handle success (e.g., show success message, update UI)
        onClose();
        taskForm.resetFields();
        setDescription("");
        // Optionally, clear form, update state, redirect user, or refresh data
      } else {
        // Handle non-successful responses
        console.error("Failed to create task:", response.statusText);
        // Optionally, show error message to the user
      }
    } catch (error) {
      // Handle errors that occur during the API call
      console.error("Error submitting task:", error);
      // Optionally, show error message to the user
    }
  };

  return (
    <div>
      <Drawer
        title="Drawer with extra actions"
        placement="bottom"
        width={900}
        height="86%"
        onClose={onClose}
        open={props.open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              className="qa-button"
              type="primary"
              onClick={() => {
                taskForm.submit();
                // onClose();
              }}>
              Submit
            </Button>
          </Space>
        }>
        <Form name="taskForm" form={taskForm} onFinish={submitHandler}>
          <Form.Item
            name="taskTitle"
            rules={[
              {
                required: true,
                message: "Title can not be empty!!",
              },
            ]}
            label="Task Title">
            <Input placeholder="Task Title" />
          </Form.Item>
          <Form.Item
            name="taskDescription"
            valuePropName="description"
            label="Task Description">
            <ReactQuill
              value={description}
              theme="snow"
              onChange={handleDescriptionChange}
              placeholder="Describe your task here"
              className="rounded-md  bg-white h-96 mb-10"
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
          </Form.Item>
          <Form.Item name="users" label="Assignees">
            <Select
              mode="multiple"
              style={{
                width: "100%",
              }}
              rules={[
                {
                  required: true,
                  message: "Title can not be empty!!",
                },
              ]}
              placeholder="Please select"
              options={props.users}
              showSearch // Enables the search functionality
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            />
          </Form.Item>
          <Form.Item
            label="End Date"
            name="endDate"
            rules={[
              {
                required: true,
                message: "End Date cannot be empty!!",
              },
            ]}>
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              disabledDate={(current) =>
                current && current < moment().add(1, "days").startOf("day")
              }
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default TasksDrawer;
