const Notice = require("./noticeModel").Notice;
const User = require("../userModel").User;
const Task=require('./taskModel').Task

User.hasMany(Notice, {
  foreignKey: "userId",
  sourceKey: "userId",
});

Notice.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "userId",
});
Task.belongsToMany(User,{through:'taskUser'})
User.belongsToMany(Task,{through:'taskUser'})

const postNotice = async (data) => {
  // const {noticeDescription,noticeTitle,userId,companyId}=data
  return await Notice.create(data);
};
const getNotice = async () => {
  return await Notice.findAll();
};
const getNoticeById = async (id) => {
  return await Notice.findOne({ where: { noticeId: id } });
};
const deleteNotice = async (id) => {
  return await Notice.destroy({ where: { noticeId: id } });
};
 const findNoticeBYUserId=async(id)=>{
     return await Notice.findAll({where:{userId:id}})
 }
 const assignTask=async(data)=>{
  const { userId,task_due_date,task_status, task_description,task_name} = data;
  // Count the number of tasks assigned to the user with status other than 'Completed'
  const incompleteTasksCount = await Task.count({
    where: {
      userId: userId,
      task_status: {
        [Op.not]: 'Completed'
      }
    }
  });

  // Check if the count is less than or equal to 2
  if (incompleteTasksCount <= 2) {
    // Create the new task
    const task = await Task.create(data);
    return task;
  } else {
    throw new Error('Cannot assign task. The user has more than 2 incomplete tasks.');
  }
 }
 const taskUpDate=async(id)=>{
  return await Task.update({where:{task_id:id}})
 }
 const getTaskByUserId=async(data)=>{
  return await Task.findAll({where:{userId:data}})

 }
 const getAllTaskList=async()=>{
  return await Task.findAll()
 }
module.exports = {
  Notice,
  User,
  postNotice,
  getNotice,
  getNoticeById,
  deleteNotice,
  findNoticeBYUserId,

  assignTask,
  taskUpDate,
  getTaskByUserId,
  getAllTaskList


};
