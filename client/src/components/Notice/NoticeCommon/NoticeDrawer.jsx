import { Button, Drawer, Form, Input, Select, Space } from "antd";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import api from "../../../utils/api";

const NoticeDrawer = ({
  setOpen,
  open,
  companies,
  setRefetch,
  data,
  setStatus,
  status,
  userName,
  setData,
}) => {
  const [noticeForm] = Form.useForm();
  const [description, setDescription] = useState("");
  useEffect(() => {
    if (Object.keys(data).length) {
      setDescription(data.noticeDescription);
    }
  }, [data]);

  const onClose = () => {
    setRefetch((prev) => !prev);
    setData({});
    noticeForm.resetFields();
    setDescription("");
    setStatus("");
    setOpen(false);
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const noticeSubmitHandler = async (values) => {
    try {
      if (status === "edit") {
        const response = await api.put(`/api/notice/${data.noticeId}`, {
          noticeTitle: values.noticeTitle,
          noticeDescription: description,
          companies: values.companies,
        });

        // Check if the response is successful
        if (response.status === 200) {
          onClose();
        } else {
          console.error("Failed to edit notice", response.data);
          setStatus("");
          noticeForm.resetFields();
        }
        return;
      }
      const response = await api.post("/api/notice", {
        userName: userName,
        noticeTitle: values.noticeTitle,
        noticeDescription: description,
        companies: values.companies,
      });

      // Check if the response is successful
      if (response.status === 200) {
        onClose();
      } else {
        console.error("Failed to post notice", response.data);
        onClose();
      }
    } catch (error) {
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
        open={open}
        extra={
          <Space>
            <Button
              onClick={() => {
                onClose();
              }}>
              Cancel
            </Button>
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
          name="noticeForm"
          initialValues={Object.keys(data).length ? data : {}}>
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
              defaultValue={
                Object.keys(data).length ? data.noticeDescription : description
              }
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
              options={companies}
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
