const {
  noticePost,
  noticeGet,
  noticeGetById,
  noticeDelete,
  getNoticeByUserC,
} = require("../../controllers/NoticeController/noticeController");
const router = require("express").Router();

router.post("/notice", noticePost);
router.get("/notice", noticeGet);
router.get("/notice/:id", noticeGetById);
router.delete("/notice/:id", noticeDelete);
router.get("/notice/user/:id", getNoticeByUserC);

module.exports = router;
