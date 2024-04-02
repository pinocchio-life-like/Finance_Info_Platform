const sequelize = require('../../config/db.config');
const { DataTypes } = require('sequelize');

const Question = sequelize.define('Question', {
  question_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  question_title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  question_description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "userId",
    },
  },
  // tag: {
  //   type: DataTypes.STRING, // Storing tags as a string
  //   allowNull: false,
  //   get() {
  //     const tagsString = this.getDataValue('tags');
  //     return tagsString ? tagsString.split(';') : []; // Assuming tags are separated by ';'
  //   },
  //   set(tag) {
  //     if (Array.isArray(tag)) {
  //       this.setDataValue('tags', tag.join(';')); // Joining array into a string
  //     } else if (typeof tag === 'string') {
  //       this.setDataValue('tags', tag); // Set the string directly
  //     } else {
  //       this.setDataValue('tags', ''); // Set an empty string if tags is neither array nor string
  //     }
  //   },
  // }
});

// const askQuestion = async (questions) => {
//   const { question_title, question_description, userId, tags } = questions;
//   const question = await Question.create({
//     question_title,
//     question_description,
//     tag: tags || [], 
//     userId
//   });
//   return question;
// }

// const updateQuestion = async (id, questions) => {
//   const { question_title, question_description, tag, userId } = questions;
//   const question = await Question.update({
//     question_title,
//     question_description,
//     tag:tag||[],
//     userId
//   }, {
//     where: {
//       question_id: id
//     }
//   });
//   return question;
// }

const getAllQuestions = async () => {
  return await Question.findAll();
}

const getSingleQ = async (id) => {
  return await Question.findByPk(id);
}

const deleteQuestions = async (id) => {
  return await Question.destroy({ where: { question_id: id } });
}

module.exports = {
  Question,
  // askQuestion,
  // updateQuestion,
  getAllQuestions,
  deleteQuestions,
  getSingleQ
};

