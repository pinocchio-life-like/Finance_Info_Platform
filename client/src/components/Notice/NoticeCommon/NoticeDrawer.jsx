import { Button, Drawer, Form, Input, Select, Space } from "antd";
import { useState } from "react";
import ReactQuill from "react-quill";
import api from "../../../utils/api";
import { jwtDecode } from "jwt-decode";

const NoticeDrawer = (props) => {
  const [noticeForm] = Form.useForm();
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

  const noticeSubmitHandler = async (values) => {
    try {
      const response = await api.post("/api/notice", {
        userName: userName,
        noticeTitle: values.noticeTitle,
        noticeDescription: description,
        companies: values.companies,
      });

      // Check if the response is successful
      if (response.status === 200) {
        // Display success message
        console.log("Notice posted successfully", response.data);
        // Optionally, reset the form or redirect the user
      } else {
        // Handle client or server errors
        console.error("Failed to post notice", response.data);
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error("An error occurred while posting the notice", error);
    }
  };
  return (
    <div>
      <Drawer
        title="Create New Notice"
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
              onClick={() => noticeForm.submit()}>
              Submit
            </Button>
          </Space>
        }>
        <Form
          form={noticeForm}
          onFinish={noticeSubmitHandler}
          name="noticeForm">
          <Form.Item
            name="noticeTitle"
            rules={[
              {
                required: true,
                message: "Title can not be empty!!",
              },
            ]}
            label="Notice Title">
            <Input placeholder="Notice Title" />
          </Form.Item>
          <Form.Item
            name="noticeDescription"
            valuePropName="description"
            label="Notice Description">
            <ReactQuill
              value={description}
              theme="snow"
              onChange={handleDescriptionChange}
              placeholder="Describe your notice here"
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
                  ["link", "image", "video"],
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
                "video",
              ]}
            />
          </Form.Item>
          <Form.Item name="companies" label="Company">
            <Select
              mode="multiple"
              style={{
                width: "100%",
              }}
              placeholder="Please select"
              options={props.companies}
              showSearch // Enables the search functionality
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default NoticeDrawer;
