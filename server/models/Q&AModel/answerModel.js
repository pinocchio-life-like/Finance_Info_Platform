const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.config");
const User = require("../userModel").User;
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
  // userId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   references: {
  //       model: "Users",
  //       key: "userId",
  //     },
  // },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    // references: {
    //   model: "Users",
    //   key: "userName",
    // },
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

//Answer.belongsTo(User, { foreignKey: "userName" });
const answerQuestion = async (ans) => {
  const { content, question_id, userName } = ans;
  const answer = await Answer.create({
    content,
    question_id,
    userName,
  });
  return answer;
};
const getAllAnswerOfAquestion = async (qId) => {
  const answer = await Answer.findAll({
    where: {
      question_id: qId,
    },
    // include: [
    //   {
    //     model: User,
    //     attributes: ['userName'],
    //   },
    // ],
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
