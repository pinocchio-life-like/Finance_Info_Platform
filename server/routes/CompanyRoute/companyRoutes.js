const {
  getAllCompaniesC,
} = require("../../controllers/CompanyController/companyController");
const router = require("express").Router();

router.get("/companies/getAll", getAllCompaniesC);

module.exports = router;
