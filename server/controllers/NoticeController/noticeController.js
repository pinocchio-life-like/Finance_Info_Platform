const { Sequelize } = require("sequelize");
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
      const companyIds = companies.map((company) =>
        company.hasOwnProperty("value") ? company.value : company
      );
      await notice.addCompanies(companyIds);
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
    const companyId = user.Company.company_Id;

    const notices = await Notice.findAll({
      include: [
        {
          model: Company,
          through: {
            attributes: [],
          },
          attributes: ["company_Id", "company_Name"],
        },
      ],
      where: Sequelize.literal(`EXISTS (
        SELECT 1
        FROM \`companynotice\` AS cn
        INNER JOIN \`Companies\` AS c ON c.\`company_Id\` = cn.\`CompanyCompanyId\`
        WHERE cn.\`noticeNoticeId\` = Notice.\`noticeId\`
        AND c.\`company_Id\` = ${companyId}
      )`),
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

const noticeUpdate = async (req, res) => {
  try {
    const { noticeDescription, noticeTitle, companies } = req.body;
    const noticeId = req.params.id;

    // Update the notice
    const [updated] = await Notice.update(
      { noticeDescription, noticeTitle },
      { where: { noticeId } }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    const notice = await Notice.findByPk(noticeId);

    if (companies.length === 0) {
      const allCompanies = await Company.findAll({
        attributes: ["company_Id"],
      });
      const companyIds = allCompanies.map((company) => company.company_Id);
      console.log(
        "No companies provided, associating with all companies",
        companyIds
      );
      await notice.setCompanies(companyIds);
    } else {
      // Extract company IDs from the companies array
      const companyIds = companies.map((company) =>
        company.hasOwnProperty("value") ? company.value : company
      );
      console.log("Associating with provided companies", companyIds);
      await notice.setCompanies(companyIds);
    }

    return res.status(200).json({
      message: "Notice updated successfully",
      data: notice,
    });
  } catch (error) {
    console.error("Error updating notice:", error);
    return res.status(500).json({
      message: "Something went wrong while updating the notice",
    });
  }
};

module.exports = {
  noticePost,
  noticeGet,
  noticeGetById,
  noticeDelete,
  getNoticeByUserC,
  noticeUpdate,
};
