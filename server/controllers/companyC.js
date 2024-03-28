const{createCompany,getAllCompanies}=require('../models/companyModel')
const companyC=(req,res)=>{
    const {company_name,maincompany_id}=req.body
    const comp=createCompany({company_name,maincompany_id})
    if(!comp){
        return res.status(500).json(
            {
                message:"something went wrong"
            }
        )
    }
    else{
        return res.status(2001).json({
            message:"company created",
            data:comp
        })
    }


}
const getAllCompaniesC = async (req, res) => {
    const { maincompany_id } = req.params;
    const companies = await getAllCompanies(maincompany_id);
    
    if (!companies) {
        return res.status(500).json({
            message: "Something went wrong"
        });
    } else {
        return res.status(200).json({
            message: "Company list",
            data: companies
        });
    }
}
module.exports={
    companyC,
    getAllCompaniesC,
}