import api from "../utils/api"

const getAllUsers=async()=>{
const users= await api.get('/api/users')
// console.log(users.data)
if(!users){
    return 
}
return users
}

export default getAllUsers