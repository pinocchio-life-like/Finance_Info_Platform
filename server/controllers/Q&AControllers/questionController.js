const {
  getAllQuestions,
  deleteQuestions,
  getSingleQ,
} = require("../../models/Q&AModel/questionModel");
const {
  askQuestion,
  updateQuestion,
  Answer,
  Comment,
  getComment,
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
const getSingleQuestionC = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await getSingleQ(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    } else {
      const questionComment = await getComment({ referred_id: id, referred_type: "question", });
      const answers = await Answer.findAll({ where: { question_id: id } });

      let commentPromises = answers.map(async (answer) => {
        const comments = await Comment.findAll({
          where: {
            referred_id: answer.dataValues.answer_id,
            referred_type: "answer",
          },
        });

        return {
          ...answer.dataValues,
          comments: comments.map((comment) => ({
            content: comment.dataValues.content,
            createdAt: comment.dataValues.createdAt,
            userName:comment.dataValues.userName,
            // You can include other properties of the comment as needed
          })),
        };
      });

      const answersWithComments = await Promise.all(commentPromises);
      // const answerCount = answers.length;

      // Attach the count property to each answer object
      // const answersWithCount = answersWithComments.map((answer) => ({
      //   ...answer,
      //   count: answerCount,
      // }));

      // Include the answers with comments in the question object
      question.dataValues.answers = answersWithComments;
      question.dataValues.comments = questionComment;

      return res
        .status(200)
        .json({ message: "Question found", data: question });
    }
  } catch (error) {
    console.error("Error fetching single question:", error);
    res.status(500).json({ message: "Internal server error" });
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
module.exports = {
  askQuestionC,
  getAllQuestionsC,
  updateQuestionC,
  deleteQC,
  getSingleQ,
  getSingleQuestionC,
};
