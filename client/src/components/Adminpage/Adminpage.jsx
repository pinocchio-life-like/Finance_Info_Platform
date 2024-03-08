import React, { useState } from 'react';
import AdminUserAddForm from "./AdminUserAddForm";
import AdminMenu from "./AdminMenu";
import UserList from "./UserList";

const AdminPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUserList, setShowUserList] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left side */}
      <div className="w-1/6 bg-gray-800 text-white p-1">
        <AdminMenu 
          onAddFormClick={() => {
            setShowAddForm(!showAddForm);
            setShowUserList(false);
          }}
          onUserListClick={() => {
            setShowUserList(!showUserList);
            setShowAddForm(false);
          }}
        />
      </div>
      
      {/* Right side */}
      <div className="w-3/4 p-1">
        <div className="mb-8">
          {/* <h1 className="text-2xl font-bold">Admin Page</h1> */}
        </div>
        
        {showAddForm && (
          <div className="mb-8">
            <AdminUserAddForm />
          </div>
        )}
        
        {showUserList && (
          <div>
            <UserList />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;