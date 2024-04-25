const { getAllTags } = require("../../models/Q&AModel/tagModel");
const answerC = async (req, res) => {
  const { content, question_id, userId } = req.body;
  const answer = await answerQuestion({ content, question_id, userId });
  if (!answer) {
    return res.status(500).json({
      message: "something went wrong",
    });
  } else {
    return res.status(200).json({
      message: "answer created",
      data: answer,
    });
  }
};
const getTags = async (req, res) => {
  try {
    const tags = await getAllTags();
    return res.status(200).json({
      message: "success",
      data: tags,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while fetching tags",
    });
  }
};

module.exports = { getTags };
