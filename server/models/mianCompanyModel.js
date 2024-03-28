// const { DataTypes } = require('sequelize');
// const sequelize = require("../config/db.config");
// const company = require("./companyModel").company;

// const mainCompany = sequelize.define("mainCompany", {
//     maincompany_id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     maincompany_name: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     Address:{
//         type:DataTypes.STRING,
//         allowNull:false
//     }

// });

// mainCompany.hasMany(company, {
//     foreignKey: "maincompany_id",
//     sourceKey: "maincompany_id"
// });

// company.belongsTo(mainCompany, {
//     foreignKey: "maincompany_id",
//     targetKey: "maincompany_id"
// });

// const createMainCompany = async (comp) => {
//     const { maincompany_name, Address } = comp;
//     const main = await mainCompany.create({ maincompany_name, Address });
//     return main;
// }

// const getAllMainCompany = async () => {
//     const main = await mainCompany.findAll();
//     return main;
// };

// module.exports = {
//     mainCompany,
//     createMainCompany,
//     getAllMainCompany
// };
