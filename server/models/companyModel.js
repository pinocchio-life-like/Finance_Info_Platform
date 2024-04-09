const { DataTypes } = require('sequelize');
const sequelize = require("../config/db.config");

const Company = sequelize.define("company", {
    company_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parentCompany: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

const createCompany = async (companyData) => {
    try {
        const { company_name, parentCompany } = companyData;
        const comp = await Company.create({
            company_name,
            parentCompany
        });
        return comp;
    } catch (error) {
        throw new Error("Error while creating company: " + error.message);
    }
};

const getAllCompanies = async () => {
    try {
        // const companies = await Company.findAll({
        //     include: {
        //         model: Company,
        //         as: 'subcompanies',
        //         where: { parentCompany: sequelize.col('company.company_name') }
        //     }
        // });
         const companies=await Company.findAll()
         const maincompanies=[]
         const subsidarycompanies=[]
        //  console.log(subsidarycompanies)
         companies.forEach((company)=>{
             if(company.parentCompany===null){
                 maincompanies.push({...company.toJSON(),subsidarycompanies:[]})
             }else{
                 subsidarycompanies.push(company.toJSON())
             }
         })
         subsidarycompanies.forEach((sub=>{
            const mianIndex=maincompanies.findIndex(main=>main.company_name===sub.parentCompany)
         if(mianIndex!==-1){
             maincompanies[mianIndex].subsidarycompanies.push(sub)
         }
         }))
        return maincompanies;
    } catch (error) {
        throw new Error("Error while fetching companies: " + error.message);
    }
};

module.exports = {
    Company,
    createCompany,
    getAllCompanies
};