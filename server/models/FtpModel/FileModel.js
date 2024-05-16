const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db.config');
const fs = require('fs');
const { Folder } = require('./FolderModel');

const File = sequelize.define('file', {
    file_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    file_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mime_type: {
        type: DataTypes.STRING
    },
    folder_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Folder,
            key: "folder_id"
        }
    }
});


const createFile = async (file, folder) => {
    try {
       
        return  await File.create({
            file_name: file.originalname,
              mime_type: file.mimetype,
            //   size: file.size,
            file_url: file_url.join(folder ? folder.file_url : '', file.originalname),
            // file_url: folder ? `${req.protocol}://${req.get("host")}/uploads/${file.originalname}` :  file.originalname,
              FolderId: folder ? folder.id : null,
            });
          
    } 
    catch (error) {
        throw new Error('Error creating file: ' + error.message);
    }
};


const getFiles = async () => {
    try {
        const files = await File.findAll();
        return files;
    } catch (error) {
        throw new Error('Error getting files: ' + error.message);
    }
};

const readFile = async (fileId) => {
    try {
        const file = await File.findByPk(fileId);
        if (!file) {
            throw new Error('File not found');
        }
       
        const data = fs.readFileSync(file.file_url);
        return data;
    } catch (error) {
        throw new Error('Error reading file: ' + error.message);
    }
};


const downloadFile = async (fileId, destinationPath) => {
    try {
        const file = await File.findByPk(fileId);
        if (!file) {
            throw new Error('File not found');
        }
       
        fs.copyFileSync(file.file_url, destinationPath);
        return true; 
    } catch (error) {
        throw new Error('Error downloading file: ' + error.message);
    }
};

module.exports = {
    File,
    createFile,
    getFiles,
    readFile,
    downloadFile
};