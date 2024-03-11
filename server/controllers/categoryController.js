const { Category } = require("../models/categoryModel");

const addCategory = async (req, res) => {
  try {
    const { category } = req.body;

    // Count the number of existing categories
    const existingCategoriesCount = await Category.count();

    // Create a new category
    const newCategory = await Category.create({
      category,
      order: existingCategoriesCount + 1,
    });

    // Send the new category as a response
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error in addCategory: ", error);
    res.status(500).json({ error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error in getCategories: ", error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = { addCategory, getCategories };
