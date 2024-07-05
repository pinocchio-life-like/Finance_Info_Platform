const {
  postNotice,
  getNotice,
  getNoticeById,
  deleteNotice,
  findNoticeBYUserId,
} = require("../../models/NoticeBoardModel/association");

const noticePost = async (req, res) => {
  const { noticeDescription, noticeTitle, userName, company_Name } = req.body;

  const notice = await postNotice({
    noticeDescription,
    noticeTitle,
    userName,
    company_Name,
  });

  if (!notice) {
    return res.status(500).json({
      message: "something went wrong while posting notice",
    });
  }

  return res.status(200).json({
    message: "notice created",
    data: notice,
  });
};

const noticeGet = async (req, res) => {
  const notice = await getNotice();

  if (!notice) {
    return res.status(500).json({
      message: "something went wrong while fetching notice",
    });
  }

  return res.status(200).json({
    message: "here is the notice",
    data: notice,
  });
};

const noticeGetById = async (req, res) => {
  const notice = await getNoticeById(req.params.id);

  if (!notice) {
    return res.status(500).json({
      message: "something went wrong while getting notice through id",
    });
  }

  return res.status(200).json({
    message: "here is your notice",
    data: notice,
  });
};

const noticeDelete = async (req, res) => {
  const notice = await deleteNotice(req.params.id);

  if (!notice) {
    return res.status(500).json({
      message: "something went wrong when try to delate nnotice",
    });
  }

  return res.status(200).json({
    message: "notice deleted success",
    data: notice,
  });
};
const getNoticeByUserC = async (req, res) => {
  const notice = await findNoticeBYUserId(req.params.id);
  if (!notice) {
    return res.status(500).json({
      message: "something went wrong while fetching notice by User",
    });
  }

  return res.status(200).json({
    message: "here is your notice",
    data: notice,
  });
};

module.exports = {
  noticePost,
  noticeGet,
  noticeGetById,
  noticeDelete,
  getNoticeByUserC,
};
