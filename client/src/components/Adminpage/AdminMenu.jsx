import React from 'react';
function AdminMenu({ onAddFormClick, onUserListClick }) {
  return (
    <div className="bg-gray-800 text-white p-1 ">
      <h1 className="text-2xl font-bold mt-12 mb-8">AdminMenu</h1>
      <nav>
        <ul>
          <li className="mb-2">
            <button onClick={onAddFormClick} className="hover:underline">Add User</button>
            
          </li>
          <li>
            <button onClick={onUserListClick} className="hover:underline">User List</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminMenu;
