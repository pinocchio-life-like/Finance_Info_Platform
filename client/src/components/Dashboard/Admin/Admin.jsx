import { FaPlus, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  Button,
  Cascader,
  Drawer,
  Form,
  Input,
  Select,
  Table,
  message,
} from "antd";
import api from "../../../utils/api";
import { jwtDecode } from "jwt-decode";

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
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [drawerData, setDrawerData] = useState(null);
  const [users, setUsers] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [updateform] = Form.useForm();
  const [newform] = Form.useForm();
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

  function transformDataToHierarchy(data) {
    let map = {},
      node,
      roots = [],
      i;

    for (i = 0; i < data.length; i += 1) {
      map[data[i].company_Id] = i; // initialize the map
      data[i].children = []; // initialize the children
    }

    for (i = 0; i < data.length; i += 1) {
      node = data[i];
      if (node.company_parent_Id !== null) {
        // if you have dangling branches check that map[node.company_parent_Id] exists
        data[map[node.company_parent_Id]].children.push({
          value: node.company_Id,
          label: node.company_Name,
          children: node.children,
        });
      } else {
        roots.push({
          value: node.company_Id,
          label: node.company_Name,
          children: node.children,
        });
      }
    }
    return roots;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users/getall");
        setUsers(response.data.data);
        setTableData(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();

    const fetcComapanies = async () => {
      try {
        const response = await api.get("/api/companies/getAll");
        const transformedData = transformDataToHierarchy(response.data.data);
        setCompanies(transformedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetcComapanies();
  }, []);

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

      // check if companyId is not null before filtering
      if (companyId !== null) {
        // filter the users data
        const filteredUsersData = response.data.data.filter(
          (user) => user.company_Id === companyId
        );
        setTableData(filteredUsersData);
      } else {
        // if companyId is null, display all users data
        setTableData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onFinishUpdate = async (values) => {
    const lastCompanyId = Array.isArray(values.company_Id)
      ? values.company_Id[0]
      : values.company_Id;

    const newValues = {
      ...values,
      company_Id: lastCompanyId,
    };

    try {
      await api.put(`/api/user/update/${drawerData.userId}`, newValues);
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
    const lastCompanyId = values.company_Id[values.company_Id.length - 1];
    const newValues = {
      ...values,
      company_Id: lastCompanyId,
    };

    try {
      await api.post("/api/users", newValues);
      onCloseAdd();
      success("User added successfully");
      fetchUsers();
    } catch (e) {
      error(
        "User with this username already exists! please choose another username."
      );
    }
  };

  const onChange = (value) => {
    const company_Id = value[value.length - 1];
    setCompanyId(company_Id);
    // filter the users data
    const filteredUsersData = users.filter(
      (user) => user.company_Id === company_Id
    );

    // update the users data state
    setTableData(filteredUsersData);
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
            <a
              className={"p-2 cursor-pointer border-b-2 border-black font-bold"}
              style={{ lineHeight: "2rem" }}
            >
              User
            </a>
          </div>
        </div>
        <div style={{ width: "95%" }}>
          <div style={{ width: "100%" }} className="flex flex-row">
            <div style={{ width: "100%" }} className="">
              <div
                style={{ width: "100%" }}
                className="flex flex-col justify-between items-center"
              >
                <div
                  style={{ width: "100%" }}
                  className="flex items-center justify-between mt-1 pl-2 border-b border-gray-600 pb-1"
                >
                  <div className="flex">
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
                  <div style={{ width: "400px" }}>
                    <Cascader
                      style={{ width: "400px" }}
                      options={companies}
                      onChange={onChange}
                      changeOnSelect
                    />
                  </div>
                </div>
                <Table
                  size="small"
                  style={{ width: "100%" }}
                  rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                  }}
                  columns={columns}
                  dataSource={tableData}
                  rowKey={"userId"}
                  onRow={(record) => ({
                    onClick: () => {
                      if (record.userName !== userName) {
                        setDrawerData(record);
                        showDrawer();
                      }
                    },
                  })}
                />
              </div>
            </div>
          </div>
        </div>
        <Drawer width={500} title="Update User" onClose={onClose} open={open}>
          <Form
            onFinish={onFinishUpdate}
            form={updateform}
            layout="vertical"
            variant="filled"
            style={{
              maxWidth: 600,
            }}
            initialValues={drawerData || {}}
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
              label="Company of Employment"
              name="company_Id"
              rules={[
                {
                  required: true,
                  message: "Please input!",
                },
              ]}
            >
              <Cascader options={companies} changeOnSelect />
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

            <Form.Item label="Password" name="password">
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
                Update User
              </Button>
            </Form.Item>
          </Form>
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
              label="Company of Employment"
              name="company_Id"
              rules={[
                {
                  required: true,
                  message: "Please input!",
                },
              ]}
            >
              <Cascader options={companies} changeOnSelect />
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
