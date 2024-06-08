const Question = require("./questionModel").Question;
const Answer = require("./answerModel").Answer;
const Comment = require("./commentModel").Comment;
// const User = require("../userModel").User;
const Tag = require("./tagModel").Tag;

// User.hasMany(Question, {
//   foreignKey: "userId",
//   sourceKey: "userId",
// });
// Question.belongsTo(User, {
//   foreignKey: "userId",
//   targetKey: "userId",
// });
// User.hasMany(Answer, {
//   foreignKey: "userId",
//   sourceKey: "userId",
// });
// Answer.belongsTo(User, {
//   foreignKey: "userId",
//   targetKey: "userId",
// });
Question.hasMany(Answer, {
  foreignKey: "question_id",
  sourceKey: "question_id",
});
Answer.belongsTo(Question, {
  foreignKey: "question_id",
  targetKey: "question_id",
});
Question.hasMany(Comment, {
  foreignKey: "referred_id",
  constraints: false,
  scope: { referred_type: "question" },
});
Comment.belongsTo(Question, {
  foreignKey: "referred_id",
  constraints: false,
  scope: { referred_type: "question" },
});
Answer.hasMany(Comment, {
  foreignKey: "referred_id",
  constraints: false,
  scope: { referred_type: "answer" },
});
Comment.belongsTo(Answer, {
  foreignKey: "referred_id",
  constraints: false,
  scope: { referred_type: "answer" },
});

Question.belongsToMany(Tag, { through: "QuestionTag" });
Tag.belongsToMany(Question, { through: "QuestionTag" });
const askQuestion = async (questionData, tagNames) => {
  try {
    if (!Array.isArray(tagNames)) {
      throw new Error("tagNames must be an array");
    }

    const question = await Question.create(questionData);

    for (const tagName of tagNames) {
      let [tag, created] = await Tag.findOrCreate({
        where: { tag_name: tagName.toLowerCase() },
        defaults: { useCount: 1 },
      });

      if (!created) {
        await tag.increment("useCount");
      }

      await question.addTag(tag);
    }

    return question;
  } catch (error) {
    throw new Error("Error while asking question: " + error.message);
  }
};

const updateQuestion = async (questionId, questionData, tagNames) => {
  try {
    if (!Array.isArray(tagNames)) {
      throw new Error("tagNames must be an array");
    }

    const question = await Question.findByPk(questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    await question.update(questionData);

    await question.removeTags();

    for (const tagName of tagNames) {
      let [tag, created] = await Tag.findOrCreate({
        where: { tag_name: tagName },
      });
      await question.addTag(tag);
    }

    return question;
  } catch (error) {
    throw new Error("Error while updating question: " + error.message);
  }
};

const postComment = async (data) => {
  try {
    const { content, referred_id, referred_type, userName } = data;
    let referredItem;
    if (referred_type === "question") {
      referredItem = await Question.findByPk(referred_id);
    } else if (referred_type === "answer") {
      referredItem = await Answer.findByPk(referred_id);
    } else {
      throw new Error("Invalid referred type");
    }

    if (referredItem) {
      const comment = await Comment.create({
        content,
        referred_id,
        referred_type,
        userName,
      });
      return comment;
    } else {
      throw new Error("Referred item not found");
    }
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error;
  }
};
const getComment = async (data) => {
  try {
    if (!data || !data.referred_id) {
      throw new Error("Invalid data or referred_id is missing");
    }
    const comment = await Comment.findAll({
      where: {
        referred_id: data.referred_id,
        referred_type: data.referred_type,
      },
    });
    return comment;
  } catch (error) {
    console.error("Error getting comment:", error);
    throw error;
  }
};

module.exports = {
  Question,
  Answer,
  Comment,
  postComment,
  getComment,
  askQuestion,
  updateQuestion,
};
