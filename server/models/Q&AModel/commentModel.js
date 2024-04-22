const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db.config');
// const Question = require('./question');
// const Answer = require('./answer');

const Comment = sequelize.define('Comment', {
  comment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // userId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   references: {
  //     model: "Users",
  //     key: "userId"
  //   }
  // },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    // references: {
    //   model: "Users",
    //   key: "userName",
    // },
  },
  referred_id: {
    type: DataTypes.INTEGER
  },
  referred_type: {
    type: DataTypes.ENUM('question', 'answer'), // Indicates whether it refers to a question or an answer
    allowNull: false
  }
});

// Define associations
// Comment.belongsTo(Question, { foreignKey: 'referred_id', constraints: false, scope: { referred_type: 'question' } });
// Comment.belongsTo(Answer, { foreignKey: 'referred_id', constraints: false, scope: { referred_type: 'answer' } });
 
module.exports = {Comment};