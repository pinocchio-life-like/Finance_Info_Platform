import { Button, DatePicker, Drawer, Form, Input, Select, Space } from "antd";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import moment from "moment";
import api from "../../../utils/api";

const TasksDrawer = ({
  setOpen,
  open,
  users,
  setRefetch,
  userName,
  taskData,
  setTaskStatus,
  taskStatus,
  setTaskData,
}) => {
  const [taskForm] = Form.useForm();
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (Object.keys(taskData).length) {
      setDescription(taskData.task_description);
    }
  }, [taskData]);

  const onClose = () => {
    setOpen(false);
    taskForm.resetFields();
    setDescription("");
    setTaskData({});
    setTaskStatus("");
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const submitHandler = async (values) => {
    try {
      if (taskStatus === "edit") {
        const response = await api.put(`/api/taskUpdate/${taskData.task_id}`, {
          task_name: values.taskTitle,
          task_description: description,
          users: values.users,
          task_due_date: values.endDate,
        });

        if (response.status === 200) {
          setRefetch((prev) => !prev);
        } else {
          console.error("Failed to edit task", response.statusText);
          taskForm.resetFields();
        }
        return;
      }
      const response = await api.post("/api/task", {
        task_name: values.taskTitle,
        task_description: description,
        users: values.users,
        task_due_date: values.endDate,
        userName: userName,
      });

      if (response.status >= 200 && response.status < 300) {
        setRefetch((prev) => !prev);
      } else {
        console.error("Failed to create task:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting task:", error);
    } finally {
      onClose();
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
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              className="qa-button"
              type="primary"
              onClick={() => {
                taskForm.submit();
              }}>
              Submit
            </Button>
          </Space>
        }>
        <Form
          name="taskForm"
          form={taskForm}
          onFinish={submitHandler}
          initialValues={
            Object.keys(taskData).length
              ? {
                  taskTitle: taskData.task_name,
                  taskDescription: taskData.task_description,
                  users: taskData.users,
                  endDate: moment(taskData.task_due_date),
                }
              : {}
          }>
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
              defaultValue={
                Object.keys(taskData).length
                  ? taskData.task_description
                  : description
              }
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
          <Form.Item name="users" label="Assignees">
            <Select
              mode="multiple"
              style={{
                width: "100%",
              }}
              rules={[
                {
                  required: true,
                  message: "Users can not be empty!!",
                },
              ]}
              placeholder="Please select"
              options={users}
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
