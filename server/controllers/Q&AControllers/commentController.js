const {
  postComment,
  getComment,
} = require("../../models/Q&AModel/associations");

const commentC = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await postComment(id, req.body);
    if (!comment) {
      res.status(500).json({
        message: "you can't post comment",
      });
    } else {
      res.status(200).json({
        message: "comment posted successfully",
        data: comment,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const getCommentC = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID parameter is missing" });
    }
    const comment = await getComment({ referred_id: id });
    if (!comment || comment.length === 0) {
      return res.status(404).json({ message: "No comments found" });
    }
    res.status(200).json({
      message: "Comments retrieved successfully",
      data: comment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  commentC,
  getCommentC,
};
