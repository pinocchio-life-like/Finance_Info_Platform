import React, { useState } from "react";
import api from "../../utils/api";

function AdminUserAddForm(props) {
  const [formData, setFormData] = useState({
    firstName: "",
    userName: "",
    password: "",
    userRole: "",
    confirmPassword: "",
  });
  // console.log(formData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addUser = async () => {
    const { firstName, userName, password, confirmPassword, userRole } =
      formData;

    // Basic validation
    if (password !== confirmPassword) {
      alert("Password and Confirm Password do not match");
      return;
    }

    const data = {
      firstName,
      userName,
      password,
      userRole,
    };
    try {
      // const response = await fetch(`${baseURL}/api/users`, requestOptions);
      const response = await api.post("/api/users", data);

      if (response.status === 201) {
        alert("User added successfully");
      } else if (response.status === 409) {
        alert("User already exists");
      } else {
        alert("An unexpected error occurred");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("An error occurred while adding the user");
    }

    // Clear form fields after submission
    setFormData({
      firstName: "",
      userName: "",
      password: "",
      confirmPassword: "",
      userRole: "",
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if(props.status == "edit"){
      if (
        !formData.firstName ||
        !formData.userName ||
        !formData.password ||
        !formData.confirmPassword ||
        !formData.userRole
      ) {
        props.onUpdate(formData);
        return;
      }
    }
    // Check if any required field is empty
    if (
      !formData.firstName ||
      !formData.userName ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.userRole
    ) {
      alert("Please fill out all required fields");
      return;
    }

    addUser();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">User Admin page</h1>
      <form onSubmit={handleFormSubmit}>
        <label className="block text-sm font-medium text-gray-600">
          First Name:
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="mt-1 p-2 border rounded-md w-full"
          required
        />

        <label className="block mt-4 text-sm font-medium text-gray-600">
          UserName:
        </label>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          className="mt-1 p-2 border rounded-md w-full"
          required
        />

        <label className="block mt-4 text-sm font-medium text-gray-600">
          Password:
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 p-2 border rounded-md w-full"
          required
        />

        <label className="block mt-4 text-sm font-medium text-gray-600">
          Confirm Password:
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="mt-1 p-2 border rounded-md w-full"
          required
        />

        <label className="block mt-4 text-sm font-medium text-gray-600">
          User Role:
        </label>
        <select
          name="userRole"
          value={formData.userRole}
          defaultValue={"admin"}
          onChange={handleChange}
          className="mt-1 p-2 border rounded-md w-full"
          required
        >
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <button
          type="submit"
          className="mt-4 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 
            focus:outline-none focus:ring focus:border-blue-300"
        >
          Add
        </button>
      </form>
    </div>
  );
}

export default AdminUserAddForm;
