import React, { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm } from "antd";
import { BsPencilFill, BsTrash } from "react-icons/bs";
import AdminUserAddForm from "./AdminUserAddForm";
import Draggable from "react-draggable";
import api from "../../utils/api";

function UserList() {
  const [users, setUsers] = useState([]);
  const [editedUser, setEditedUser] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users");

        if (response.data && Array.isArray(response.data.data)) {
          setUsers(response.data.data);
        } else {
          console.error("Invalid data structure:", response);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditedUser(user);
    setIsEditable(true);
  };
  
  const handleDelete = async (userId) => {
    try {
      const response = await api.delete(`/api/delete/${userId}`);
      
      if (response.status === 200) {
        message.success("User deleted successfully");
        setUsers(users.filter((user) => user.userId !== userId));
      } else {
        message.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("An error occurred while deleting the user");
    }
  };

  const updateUser = async (value) => {
    try {
      const updatedUser = await api.put(
        `/api/update/${editedUser.userId}`,
        value
      );

      if (updatedUser) {
        message.success("User updated successfully");
        setIsEditable(false);
        // Update the users list with the updated user data
        setUsers(
          users.map((user) =>
            user.userId === updatedUser.userId ? updatedUser : user
          )
        );
      } else {
        message.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      align: "center",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      align: "center",
    },
    {
      title: "User Role",
      dataIndex: "userRole",
      key: "userRole",
      align: "center",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <>
          <Button
            type="primary" ghost
            onClick={() => handleEditClick(record)}
            icon={<BsPencilFill />}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.userId)}
            okText="Yes"
            cancelText="No"
             okButtonProps={{
              ghost: true,
              style: {
                background: "none",
                border: "1px solid #1890cc",
                color: "#1890cc",
                transition: "border-color 0.6s ease",
                },
             
            }}
          >
            <Button type="danger" icon={<BsTrash />} className="ml-2" />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="w-full mx-auto pl-6 bg-white rounded-md shadow-md overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">User List</h1>
      <Table
        dataSource={users}
        columns={columns}
        pagination={{ pageSize: 10 }} 
        rowKey="userId"
      />
      {isEditable && editedUser && (
        <Draggable>
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-96 bg-white p-4 rounded-md shadow-md">
              <AdminUserAddForm
                onUpdate={updateUser}
                status="edit"
                userData={editedUser}
                onClose={() => setIsEditable(false)}
              />
            </div>
          </div>
        </Draggable>
      )}
    </div>
  );
}

export default UserList