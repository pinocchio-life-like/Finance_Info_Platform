const {
  getAllCompaniesC,
  getAllCompaniesWithUsersC,
} = require("../../controllers/CompanyController/companyController");
const router = require("express").Router();

router.get("/companies/getAll", getAllCompaniesC);
router.get("/company_users/getall", getAllCompaniesWithUsersC);

module.exports = router;
