const { Category } = require("../models/categoryModel");
const { Question } = require("../models/Q&AModel/questionModel");

const searchAllC = async (req, res) => {
  try {
    const categories = await Category.findAll();
    const questions = await Question.findAll();
    res.status(200).json({ categories, questions });
  } catch (error) {
    console.error("Error in getCategories: ", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  searchAllC,
};
