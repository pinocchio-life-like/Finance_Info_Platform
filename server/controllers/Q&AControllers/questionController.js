const {
  getAllQuestions,
  deleteQuestions,
  getSingleQ,
} = require("../../models/Q&AModel/questionModel");
const {
  askQuestion,
  updateQuestion,
} = require("../../models/Q&AModel/associations");
const askQuestionC = async (req, res) => {
  try {
    const { question_title, question_description, userName, tagNames } =
      req.body;
    console.log(req.body);
    const question = await askQuestion(
      {
        question_title,
        question_description,
        userName,
      },
      tagNames
    );
    if (!question) {
      return res.status(500).json({ message: "something went wrong" });
    } else {
      return res
        .status(200)
        .json({ message: "question posted successfully", data: question });
    }
  } catch (error) {
    console.error(error);
  }
};
const getAllQuestionsC = async (req, res) => {
  try {
    const questions = await getAllQuestions();
    if (!questions) {
      return res
        .status(500)
        .json({ message: "there is no questions posted yet" });
    } else {
      return res
        .status(200)
        .json({ message: "this are the questions asked", data: questions });
    }
  } catch (error) {
    console.error(error.message);
  }
};
const updateQuestionC = async (req, res) => {
  try {
    const { id } = req.params;
    const singleQ = await getSingleQ(id);
    if (!singleQ) {
      return res
        .status(500)
        .json({ message: "there is no question to be updated" });
    } else {
      const { question_title, question_description, tagNames, userId } =
        req.body;
      const question = await updateQuestion(id, {
        question_title,
        question_description,
        tagNames,
        userId,
      });
      if (!question) {
        return res.status(500).json({ message: "something went wrong" });
      } else {
        return res
          .status(200)
          .json({ message: "question updated successfully", data: question });
      }
    }
  } catch (error) {
    console.error(error);
  }
};
const deleteQC = async (req, res) => {
  try {
    const { id } = req.params;
    const singleQ = await getSingleQ(id);
    if (!singleQ) {
      return res
        .status(500)
        .json({ message: "there is no question to be deleted" });
    } else {
      const question = await deleteQuestions(id);
      if (!question) {
        return res.status(500).json({ message: "something went wrong" });
      } else {
        return res
          .status(200)
          .json({ message: "question deleted successfully", data: question });
      }
    }
  } catch (error) {
    console.error(error);
  }
};
module.exports = { askQuestionC, getAllQuestionsC, updateQuestionC, deleteQC };
