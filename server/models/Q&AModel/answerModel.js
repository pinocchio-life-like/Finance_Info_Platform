const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.config");

const Answer = sequelize.define("Answer", {
  answer_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT("long"),
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "userId",
    },
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Questions",
      key: "question_id",
    },
  },
});
const answerQuestion = async (ans) => {
  const { content, question_id, userId } = ans;
  const answer = await Answer.create({
    content,
    question_id,
    userId,
  });
  return answer;
};
const getAllAnswerOfAquestion = async (qId) => {
  const answer = await Answer.findAll({
    where: {
      question_id: qId,
    },
  });
  return answer;
};
// const editAnswer=async(data)=>{
//     const {answer_id,content,userId}=data
//     return await Answer.update({
//       content,
//       answer_id,
//       userId

//     })

// }

module.exports = { Answer, getAllAnswerOfAquestion, answerQuestion };
