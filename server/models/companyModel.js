const{DataTypes}=require('sequelize')
const sequelize = require("../config/db.config");
const company=sequelize.define(
    "company",{
        company_id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        company_name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        parentCompany:{
            type:DataTypes.STRING,
            allowNull:false
            

        },
        maincompany_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:"mianCompany",
                key:"maincompany_id"
            }
        }
    }
)
const createCompany=(company)=>{
    const {company_name,maincompany_id}=company
    const comp=company.create({
        company_name,
        maincompany_id
    })
    return comp
}
const getAllCompanies = async (id) => {
    try {
        const companies = await company.findAll({
            where: {
                maincompany_id: id
            }
        });
        return companies;
    } catch (error) {
        throw new Error("Error while fetching companies: " + error.message);
    }
}
module.exports={
    company,
    createCompany,
    getAllCompanies,

}