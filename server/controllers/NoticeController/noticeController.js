const {
  getNotice,
  getNoticeById,
  deleteNotice,
  findNoticeBYUserId,
  Notice,
  Company,
  User,
} = require("../../models/NoticeBoardModel/association");

const noticePost = async (req, res) => {
  try {
    const { noticeDescription, noticeTitle, userName, companies } = req.body;

    const notice = await Notice.create({
      noticeDescription,
      noticeTitle,
      userName,
    });

    // Check if 'companies' includes is null
    if (!companies) {
      // Fetch all companies from the database
      const allCompanies = await Company.findAll({
        attributes: ["company_Id"],
      });
      // Extract just the ids of all companies
      const companyIds = allCompanies.map((company) => company.company_Id);
      // Associate the notice with all companies
      await notice.addCompanies(companyIds);
    } else if (companies && companies.length) {
      // If there are specific companies to associate with the notice
      await notice.addCompanies(companies);
    }

    // Respond with success message and the created task
    return res.status(200).json({
      message: "Notice created successfully",
      data: notice,
    });
  } catch (error) {
    console.error("Error creating notice:", error);
    return res.status(500).json({
      message: "Something went wrong while posting notice",
    });
  }
};

const noticeGet = async (req, res) => {
  try {
    // Step 1: Extract userName from the request
    const { userName } = req.params; // or req.body, depending on how userName is sent

    // Step 2: Find the company associated with the user
    const user = await User.findOne({
      where: { userName },
      include: [
        {
          model: Company,
          attributes: ["company_Id"], // Assuming 'id' is the identifier for Company
        },
      ],
    });

    if (!user || !user.Company) {
      return res.status(404).json({
        message: "User or associated company not found",
      });
    }

    // Step 3: Fetch notices related to the company
    const notices = await Notice.findAll({
      include: [
        {
          model: Company,
          where: { company_Id: user.Company.company_Id },
          through: { attributes: [] }, // Do not include properties from the join table
          attributes: [], // Assuming you don't need to return company details with notices
        },
      ],
    });

    return res.status(200).json({
      message: "Here are the notices for the user's company",
      data: notices,
    });
  } catch (error) {
    console.error("Error fetching notices:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching notices",
    });
  }
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
