const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db.config');

const Answer = sequelize.define('Answer', {
  answer_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
   
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,references: {
        model: "Questions",
        key: "question_id",
      },
  }
});
const answerQuestion=async(ans)=>{
  const {content,question_id,userName}=ans
  const answer=await Answer.create({
      content,
      question_id,
      userName
  })
  return answer

}
const getAllAnswerOfAquestion=async(qId)=>{
    const answer=await Answer.findAll({
        where:{
            question_id:qId
        }
    })
    return answer
}
// const editAnswer=async(data)=>{
//     const {answer_id,content,userId}=data
//     return await Answer.update({
//       content,
//       answer_id,
//       userId

//     })


// }

module.exports = {Answer,
    getAllAnswerOfAquestion,
    answerQuestion,
};