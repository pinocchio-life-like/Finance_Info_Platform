import { Button, Cascader, Form, Input, message, Select } from "antd";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import api from "../../utils/api";

function ProfilePage() {
  const token = localStorage.getItem("token");
  const [updateform] = Form.useForm();
  const [data, setData] = useState({});
  const [messageApi, contextHolder] = message.useMessage();

  let userName = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userName = decodedToken.userName;
    } catch (error) {
      console.error("Invalid token");
    }
  }

  const success = (message) => {
    messageApi.open({
      type: "success",
      content: message || "User added successfully",
    });
  };
  const error = (message) => {
    messageApi.open({
      type: "error",
      content: message || "An error occurred. Please try again!",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(`/api/userName/${userName}`);
      console.log(response.data.data);

      setData({
        userId: response.data.data.userId,
        firstName: response.data.data.firstName,
        userName: response.data.data.userName,
        company: {
          label: response.data.data.Company.company_Name,
          value: response.data.data.company_Id,
        },
        userRole: response.data.data.userRole,
      });
    };
    fetchData();
  }, [userName]);

  useEffect(() => updateform.resetFields(), [data]);

  const onFinish = async (values) => {
    try {
      await api.put(`/api/user/update/${data.userId}`, values);
      success("Profile updated successfully");
    } catch (e) {
      error(
        "Error updating profile. Please check your internet connection and try again"
      );
    }
  };

  return (
    <div className="flex w-full items-center justify-center mt-32">
      {contextHolder}
      {data && (
        <Form
          onFinish={onFinish}
          form={updateform}
          layout="vertical"
          variant="filled"
          className="w-[60%]"
          initialValues={{
            firstName: data.firstName,
            userName: data.userName,
            company_Id: data?.company?.value,
            userRole: data.userRole,
          }}>
          <Form.Item
            label="Name"
            name="firstName"
            rules={[
              {
                required: true,
                message: "Please input!",
              },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="User Name"
            name="userName"
            rules={[
              {
                required: true,
                message: "Please input!",
              },
            ]}>
            <Input readOnly />
          </Form.Item>

          <Form.Item label="Company of Employment" name="company_Id">
            <Cascader
              options={[
                { label: data?.company?.label, value: data?.company?.value },
              ]}
              disabled
            />
          </Form.Item>

          <Form.Item
            label="User Role"
            name="userRole"
            rules={[
              {
                required: true,
                message: "Please select a role!",
              },
            ]}>
            <Select defaultValue="admin" disabled>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="reader">Reader</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Repeat-Password"
            name="re-password"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 0,
              span: 24,
            }}>
            <Button
              style={{ background: "#387ADF", color: "white", width: "100%" }}
              htmlType="submit">
              Update Credentials
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}

export default ProfilePage;
