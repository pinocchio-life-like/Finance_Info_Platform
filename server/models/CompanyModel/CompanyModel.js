const Sequelize = require("sequelize");
const sequelize = require("../../config/db.config");

const Company = sequelize.define("Companies", {
  company_Id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  },
  company_Name: {
    type: Sequelize.STRING,
    allowNull: false,
    require: true,
  },
  company_Name_En: {
    type: Sequelize.STRING,
    allowNull: false,
    require: true,
  },
  company_parent_Id: {
    type: Sequelize.STRING,
    allowNull: true,
    require: false,
  },
  company_level: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
});

Company.belongsTo(Company, { as: "Parent", foreignKey: "company_parent_Id" });

const getAllCompanies = async () => {
  try {
    return await Company.findAll();
  } catch (error) {
    console.error("An error occurred while fetching all companies:", error);
    throw error; // re-throw the error so it can be handled by the caller
  }
};

module.exports = { Company, getAllCompanies };
