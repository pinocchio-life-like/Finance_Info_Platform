const {
  noticePost,
  noticeGet,
  noticeGetById,
  noticeDelete,
  getNoticeByUserC,
  noticeUpdate,
} = require("../../controllers/NoticeController/noticeController");
const router = require("express").Router();

router.post("/notice", noticePost);
router.get("/notices/:userName", noticeGet);
router.get("/notice/:id", noticeGetById);
router.put("/notice/:id", noticeUpdate);
router.delete("/notice/:id", noticeDelete);
router.get("/notice/user/:id", getNoticeByUserC);

module.exports = router;
