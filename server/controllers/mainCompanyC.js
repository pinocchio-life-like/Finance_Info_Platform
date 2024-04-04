const { createMainCompany, getAllMainCompany } = require('../models/mianCompanyModel');

const MianC = async (req, res) => {
    try {
        const { maincompany_name, Address } = req.body;
        console.log(req.body,'test'); 
        const main = await createMainCompany({ maincompany_name, Address });

        if (!main) {
            return res.status(500).json({ message: "Something went wrong" });
        } else {
            return res.status(201).json({ message: "Main company created", data: main });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAllMainCompanyC = async (req, res) => {
    try {
        const main = await getAllMainCompany();
        if (!main) {
            return res.status(500).json({ message: "Something went wrong" });
        } else {
            return res.status(200).json({ message: "Main company list", data: main });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { MianC, getAllMainCompanyC };