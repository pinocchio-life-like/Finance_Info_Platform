const {
  getAllCompanies,
  getAllCompaniesUsers,
} = require("../../models/CompanyModel/CompanyModel");
const {
  getAllCompanies,
  getAllCompaniesUsers,
} = require("../../models/CompanyModel/CompanyModel");

//article getter
const getAllCompaniesC = async (req, res) => {
  try {
    const companies = await getAllCompanies();
    if (!companies) {
      res.json({ message: "No companies found" });
    } else {
      res.json({ message: "This are the existing companies", data: companies });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllCompaniesWithUsersC = async (req, res) => {
  const companies = await getAllCompaniesUsers();

  if (!companies) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  } else {
    return res.status(200).json({
      message: "Company list with users",
      data: companies,
    });
  }
};

module.exports = {
  getAllCompaniesC,
  getAllCompaniesWithUsersC,
};
