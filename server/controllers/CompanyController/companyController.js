const { getAllCompanies } = require("../../models/CompanyModel/CompanyModel");

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

module.exports = {
  getAllCompaniesC,
};
