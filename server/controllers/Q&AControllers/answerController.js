const {
  getAllAnswerOfAquestion,
  answerQuestion,
} = require("../../models/Q&AModel/answerModel");
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
const getAnswer = async (req, res) => {
  const answer = await getAllAnswerOfAquestion(req.params.id);
  if (!answer) {
    return res.status(500).json({
      message: "something went wrong",
    });
  } else {
    return res.status(200).json({
      message: "answer get",
      data: answer,
    });
  }
};

module.exports = { answerC, getAnswer };
