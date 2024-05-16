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
      type: "main",
    });

    // Send the new category as a response
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error in addCategory: ", error);
    res.status(500).json({ error: error.message });
  }
};

const addSubCategory = async (req, res) => {
  try {
    const { category, parent_Id } = req.body;

    const order_within_parent =
      (await Category.count({ where: { parent_Id } })) + 1;

    // Create a new category
    const newCategory = await Category.create({
      category,
      parent_Id,
      order_within_parent,
      type: "sub",
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

const updateOrder = async (req, res) => {
  const { categories } = req.body;

  console.log("Received categories:", categories);

  const updateCategoryOrder = async (categories) => {
    for (let category of categories) {
      console.log("Updating category:", category);

      // First set order_within_parent to null
      await Category.update(
        { order_within_parent: null },
        { where: { category_Id: category.id } }
      );

      if (category.subCategories) {
        await updateCategoryOrder(category.subCategories);
      }
    }

    // Then set order_within_parent to its new value
    for (let category of categories) {
      await Category.update(
        { order_within_parent: category.order_within_parent },
        { where: { category_Id: category.id } }
      );
    }
  };

  try {
    await updateCategoryOrder(categories);

    res.status(200).send({ message: "Order updated successfully" });
  } catch (error) {
    console.error("An error occurred while updating the order:", error);

    res
      .status(500)
      .send({ message: "An error occurred while updating the order", error });
  }
};

const updateMainOrder = async (req, res) => {
  console.log("Received categories:", req.body);
  const { categories } = req.body;

  console.log("Received categories:", categories);

  try {
    for (let category of categories) {
      console.log("Updating category:", category);

      // Update the order field for main categories only
      await Category.update(
        { order: category.order },
        { where: { category_Id: category.category_Id } }
      );
    }

    res.status(200).send({ message: "Order updated successfully" });
  } catch (error) {
    console.error("An error occurred while updating the order:", error);

    res
      .status(500)
      .send({ message: "An error occurred while updating the order", error });
  }
};

module.exports = {
  addCategory,
  getCategories,
  addSubCategory,
  updateOrder,
  updateMainOrder,
};
