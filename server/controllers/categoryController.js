const { Category } = require("../models/categoryModel");

const addCategory = async (req, res) => {
  try {
    const { category, parent_Id, order, order_within_parent } = req.body;
    console.log(req.body);

    // Create a new category
    // const newCategory = await Category.create({
    //   category,
    //   parent_Id,
    //   order,
    //   order_within_parent,
    // });

    // Send the new category as a response
    res.status(201).json({ bad: "man" });
  } catch (error) {
    // Send error response
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addCategory };
