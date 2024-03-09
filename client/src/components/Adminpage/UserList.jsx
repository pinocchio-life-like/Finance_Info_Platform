import React, { useEffect, useState } from 'react';
import getAllUsers from './../../services/services.user';
import { BsPencilFill } from 'react-icons/bs';
import AdminUserAddForm from './AdminUserAddForm';
import Draggable from 'react-draggable';
import api from '../../utils/api';

function UserList() {
  const [users, setUsers] = useState([]);
  const[editeId,setEditedId]=useState()
  const[isEditable,setIsEdited]=useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();

        if (response.data && Array.isArray(response.data.data)) {
          setUsers(response.data.data);
        } else {
          console.error('Invalid data structure:', response);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);
  //function to handle the user editting
  const handleEditClick = (userId) => {
    setEditedId(userId);
    setIsEdited(prevState => (prevState && userId === editeId) ? false : true);
  };
//const update function
  const updateUser = async (value) => {

    try {
      console.log(value)
      
      const updateduser= await api.put(`/api/update/${editeId}`,value)
      console.log(updateduser,'updated user')
      if(!updateduser){

        return console.log('updatting error')
      }
      else{
        alert('update success')
        setIsEdited(false);
       
      return updateduser
      }
    }
    catch (error) {
      console.error('Error updating user:', error);
    }
  }


  return (
    <div className="w-full mx-auto pl-6 bg-white rounded-md shadow-md overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">User List</h1>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border-b p-2">User Name</th>
              <th className="border-b p-2">First Name</th>
              <th className="border-b p-2">User Role</th>
              <th className="border-b p-2">Edit user</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.userId}>
                <td className="border-b p-2 font-medium text-center">{user.userName}</td>
                <td className="border-b p-2 text-gray-600 text-center">{user.firstName}</td>
                <td className="border-b p-2 text-center">{user.userRole}</td>
                <td className="border-b p-2 text-center"><button onClick={()=>handleEditClick(user.userId)}   className="bg-blue-500 text-white py-1 px-1 rounded m-2 ">
                <BsPencilFill/></button></td>
                
              </tr>
            ))}
          </tbody>
        </table>
      )}
     {isEditable && (
  <Draggable>
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-96 bg-white p-4 rounded-md shadow-md">
        {/* <h1 className="text-xl font-bold mb-4">Edit User</h1> */}
        <AdminUserAddForm onUpdate={updateUser} 
        status="edit" 
        isEditable={isEditable}
      
       />
      </div>
    </div>
  </Draggable>
)}
    </div>
  );
}

export default UserList;