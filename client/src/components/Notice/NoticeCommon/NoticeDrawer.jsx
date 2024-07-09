import { Button, Drawer, Form, Input, Select, Space } from "antd";
import { useState } from "react";
import ReactQuill from "react-quill";

const NoticeDrawer = (props) => {
  const [description, setDescription] = useState("");
  const onClose = () => {
    props.setOpen(false);
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
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
            <Button className="qa-button" type="primary" onClick={onClose}>
              Submit
            </Button>
          </Space>
        }>
        <Form name="noticeForm">
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
          <Form.Item label="Notice Description">
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
          <Form.Item label="Company">
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
