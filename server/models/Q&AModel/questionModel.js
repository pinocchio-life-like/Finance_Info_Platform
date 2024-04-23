const sequelize = require("../../config/db.config");
const { DataTypes } = require("sequelize");
const { Tag } = require("./tagModel");
const { Answer } = require("./answerModel");

const Question = sequelize.define("Question", {
  question_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  question_title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  question_description: {
    type: DataTypes.TEXT("long"),
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const getAllQuestions = async () => {
  const response = await Question.findAll({
    include: [Tag], // Include the Tag model to fetch associated tags
  });

  const data = await Promise.all(
    response.map(async (resp) => ({
      ...resp.toJSON(),
      count: await Answer.count({
        where: {
          question_id: resp.question_id,
        },
      }),
    }))
  );

  return data;
};

const getSingleQ = async (id) => {
  return await Question.findByPk(id, {
    include: [Tag],
  });
};

const deleteQuestions = async (id) => {
  return await Question.destroy({ where: { question_id: id } });
};

module.exports = {
  Question,
  // askQuestion,
  // updateQuestion,
  getAllQuestions,
  deleteQuestions,
  getSingleQ,
};
