const{createCompany,getAllCompanies}=require('../models/companyModel')
const companyC=async(req,res)=>{
    console.log(req.body)
    const {company_name,parentCompany}=req.body
    const comp=await createCompany({company_name,parentCompany})
    
    if(!comp){
        return res.status(500).json(
            {
                message:"something went wrong"
            }
        )
    }
    else{
        return res.status(201).json({
            message:"company created",
            data:comp
        })
    }


}
const getAllCompaniesC = async (req, res) => {
    // const { maincompany_id } = req.params;
    const companies = await getAllCompanies();
    
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
