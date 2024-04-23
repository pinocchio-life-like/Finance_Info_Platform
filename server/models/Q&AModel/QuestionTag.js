const sequelize = require("../../config/db.config");
const { DataTypes } = require("sequelize");

const QuestionTag = sequelize.define("QuestionTag", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
})

module.exports = { QuestionTag }