import React, { useState } from "react";
import { Form, Input, Select, Button, message } from "antd";
import api from "../../utils/api";
import { CloseOutlined } from "@ant-design/icons";

const { Option } = Select;

const AdminUserAddForm = ({ onUpdate, status, userData, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.post("/api/users", values);
      if (response.status === 201) {
        message.success("User added successfully");
        form.resetFields();
        onUpdate();
      } else if (response.status === 409) {
        message.error("User already exists");
      } else {
        message.error("An unexpected error occurred");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      message.error("An error occurred while adding the user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl p-6 bg-white rounded-md shadow-md  w-full">
      <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={userData}
      //,boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      style={{ margin: '0 auto', padding:"12px",maxWidth: '800px'  }}
    >
      <div className="flex justify-between items-center mb-4 " >
        <h1 className="text-center mx-auto">{status === "edit" ? "Update User" : "Add User"}</h1>
        {status === "edit" && (
          <Button
            type="text"
            onClick={() => onClose()}
            icon={<CloseOutlined />}
          />
        )}
      </div>
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[{ required: true, message: "Please input first name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Username"
        name="userName"
        rules={[{ required: true, message: "Please input username" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input password" }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Confirm Password"
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Please confirm password" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The two passwords do not match")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="User Role"
        name="userRole"
        rules={[{ required: true, message: "Please select user role" }]}
      >
        <Select>
          <Option value="admin">Admin</Option>
          <Option value="user">User</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} ghost>
          {status === "edit" ? "Update" : "Add"}
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};

export default AdminUserAddForm;
