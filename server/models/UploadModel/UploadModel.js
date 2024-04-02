const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db.config");

const Upload = sequelize.define("Upload", {
  upload_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category_Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  originalname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const uploadFile = async (data) => {
  const { url, type, user, category_Id, originalname } = data;
  const upload = await Upload.create({
    url,
    type,
    user,
    category_Id,
    originalname,
  });
  return upload;
};

const findAllFiles = async (category_Id) => {
  return await Upload.findAll({
    where: {
      category_Id: category_Id,
    },
  });
};

const deleteFile = async (key) => {
  return await Upload.destroy({
    where: {
      url: key,
    },
  });
};

module.exports = {
  uploadFile,
  findAllFiles,
  deleteFile,
};
