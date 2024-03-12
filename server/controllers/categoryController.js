const { Category ,createCategory} = require("../models/categoryModel");

const addCategory = async (req, res) => {
  try {
    const { category, parent_Id, order, order_within_parent } = req.body;
    console.log(req.body);
    const cat=await createCategory(req.body)

    if(!cat){
      res.status(500).json({
        message: "Category not created",
      })
    }else{
      res.status(201).json({
        message: "Category created",
      })
    }
    }

    // Send the new category as a response
    // res.status(201).json({ bad: "man" });
   catch (error) {
    // Send error response
    console.error(error,'lllllll');
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addCategory };
