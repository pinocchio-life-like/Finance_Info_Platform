import { FaPlus, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Button, Drawer, Form, Input, Select, Table, message } from "antd";
import api from "../../../utils/api";
const secretKey = import.meta.env.VITE_SECRET_KEY;
import { jwtDecode } from "jwt-decode";
import MainCompanyAdmin from "./MainCompanyAdmin";

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
  {
    key: "4",
    name: "Disabled User",
    age: 99,
    address: "Sydney No. 1 Lake Park",
  },
];
const columns = [
  {
    title: "Name",
    dataIndex: "firstName",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "User Name",
    dataIndex: "userName",
  },
  {
    title: "User Role",
    dataIndex: "userRole",
  },
  {
    title: "Password",
    dataIndex: "password",
  },
];

const Admin = () => {
  const [activeLink, setActiveLink] = useState({ left: 1, right: 0 });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [drawerData, setDrawerData] = useState(null);
  const [users, setUsers] = useState([]);
  const [updateform] = Form.useForm();
  const [newform] = Form.useForm();
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token, secretKey);
  const { userName } = decodedToken;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users/getall");
        setUsers(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (activeLink.left === 1) {
      fetchUsers();
    }
  }, [activeLink.left]);
  useEffect(() => {
    updateform.setFieldsValue(drawerData);
  }, [drawerData, updateform]);

  const [messageApi, contextHolder] = message.useMessage();
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

  const handleLink = (side, index) => {
    setActiveLink((prevState) => ({ ...prevState, [side]: index }));
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setSelectedRows(selectedRows);
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.userName === userName,
      // Column configuration not to be checked
      userName: record.userName,
    }),
  };
  const handleAdd = () => {
    newform.resetFields();
    showAddDrawer();
  };

  const handleDelete = async () => {
    try {
      const userIds = selectedRowKeys; // Array of selected user IDs
      await api.delete("/api/users/delete", { data: { userIds } });
      success("Users deleted successfully");
      fetchUsers();
    } catch (e) {
      error("Failed to delete users");
    }
  };
  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const showAddDrawer = () => {
    setOpenAdd(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onCloseAdd = () => {
    setOpenAdd(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users/getall");
      setUsers(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onFinishUpdate = async (values) => {
    try {
      await api.put(`/api/user/update/${drawerData.userId}`, values);
      success("User updated successfully");
      onClose();
      fetchUsers();
    } catch (e) {
      error(
        "Error updating, or User with this username already exists! please choose another username."
      );
    }
  };

  const onFinishAdd = async (values) => {
    try {
      await api.post("/api/users", values);
      onCloseAdd();
      success("User added successfully");
      fetchUsers();
    } catch (e) {
      error(
        "User with this username already exists! please choose another username."
      );
    }
  };
  return (
    <>
      {contextHolder}
      <div
        style={{ width: "100%" }}
        className="flex-grow flex flex-col items-center bg-white"
      >
        <div
          style={{ width: "95%" }}
          className="flex justify-between items-center border-b mt-3 border-gray-600 pb-1"
        >
          <div>
            {["Company", "User"].map((link, index) => (
              <a
                key={index}
                className={`p-2 cursor-pointer ${
                  activeLink.left === index
                    ? "border-b-2 border-black font-bold"
                    : ""
                }`}
                style={{ lineHeight: "2rem" }}
                onClick={() => handleLink("left", index)}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
        <div style={{ width: "95%" }}>
          {activeLink.left === 0 ? (
            <div>
              <MainCompanyAdmin />
            </div>
          ) : (
            <div style={{ width: "100%" }} className="flex flex-row">
              <div style={{ width: "15%" }}>
                <div
                  style={{ width: "100%" }}
                  className="flex items-center mt-2 pl-2 border-b border-gray-600 pb-1"
                >
                  <button
                    onClick={handleAdd}
                    className="flex items-center text-black hover:bg-white hover:text-green-500 rounded"
                  >
                    <FaPlus size={12} style={{ marginRight: 4 }} /> Add New company
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={selectedRows.length === 0}
                    className={`flex items-center rounded pl-4 ${
                      selectedRows.length === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-black hover:bg-white hover:text-red-500"
                    }`}>
                    <FaTrash size={12} style={{ marginRight: 4 }} /> Delete
                  </button>
                </div>
              </div>
              <div
                style={{ width: "85%" }}
                className="border-l border-gray-600"
              >
                <div
                  style={{ width: "100%" }}
                  className="flex flex-col justify-between items-center"
                >
                  <div
                    style={{ width: "100%" }}
                    className="flex items-center mt-2 pl-2 border-b border-gray-600 pb-1"
                  >
                    <button
                      onClick={handleAdd}
                      className="flex items-center text-black hover:bg-white hover:text-green-500 rounded"
                    >
                      <FaPlus size={12} style={{ marginRight: 4 }} /> Add New
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={selectedRows.length === 0}
                      className={`flex items-center rounded pl-4 ${
                        selectedRows.length === 0
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-black hover:bg-white hover:text-red-500"
                      }`}
                    >
                      <FaTrash size={12} style={{ marginRight: 4 }} /> Delete
                    </button>
                  </div>
                  <Table
                    size="small"
                    style={{ width: "100%" }}
                    rowSelection={{
                      type: "checkbox",
                      ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={activeLink.left === 1 ? users : data}
                    rowKey={activeLink.left === 1 ? "userId" : "firstName"}
                    onRow={(record) => ({
                      onClick: () => {
                        if (record.userName !== userName) {
                          // Check if the row is not disabled
                          setDrawerData(record);
                          showDrawer();
                        }
                      },
                    })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <Drawer width={500} title="Update User" onClose={onClose} open={open}>
       
            
         </Drawer> 
        <Drawer
          width={500}
          title="Add New User"
          onClose={onCloseAdd}
          open={openAdd}
        >
          <Form
            onFinish={onFinishAdd}
            form={newform}
            layout="vertical"
            variant="filled"
            style={{
              maxWidth: 600,
            }}
          >
            <Form.Item
              label="Name"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Please input!",
                },
              ]}
            >
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
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="User Role"
              name="userRole"
              rules={[
                {
                  required: true,
                  message: "Please select a role!",
                },
              ]}
            >
              <Select placeholder="Select a role">
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
                  message: "Please input!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 0,
                span: 24,
              }}
            >
              <Button
                style={{ background: "#387ADF", color: "white", width: "100%" }}
                htmlType="submit"
              >
                Save User
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    </>
  );
};

export default Admin;
