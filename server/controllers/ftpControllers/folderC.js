// const{createFolder,getFolders}=require('../../models/FtpModel/FolderModel')
// const folderController=async(req,res)=>{

//     try{
//         // const {folder_name,folder_parentId,folder_url}=req.body
//         let folder_name = req.file.filename;
//         let folder_url = req.file.path
//         let folder_parentId=req.body

//         const folder=await createFolder({folder_name,folder_parentId,folder_url})
//         if(!folder){
//             res.json({
//                 success:false

//             })

//         }
//         res.json({
//             success:true,
//             data:folder
//         })

//     }catch(error){
//         console.log(error)
//     }
// }
// const foldergetcontroller=async(req,res)=>{

//     try{
//         const folders=await getFolders()
//         if(!folders){
//             res.json({
//                 success:false
//             })
//         }

//         res.json({
//             success:true,
//             data:folders
//         })
//     }
//     catch(error){
//         console.log(error)
//     }
// }

// exports.module={
//     folderController,
//     foldergetcontroller
// }
const {
  createFolder,
  getFolders,
  uploadFolder,
} = require("../../models/FtpModel/FolderModel");
const path = require("path");
const { Folder } = require("../../models/FtpModel/FolderModel");
const { createFile } = require("../../models/FtpModel/FileModel");

const uploadFolderC = async (req, res) => {
  try {
    const parentFolderId = req.body.parent_folder_id;
    const parentFolder = parentFolderId ? await Folder.findByPk(parentFolderId) : null;

    // Check if parent folder exists
    if (parentFolderId && !parentFolder) {
      return res.status(404).send("Parent folder not found.");
    }

    // Create folder entry
    const newFolder = await Folder.create({
      name: req.body.folder_name,
      parentId: parentFolderId,
    });

    // Upload files to the created folder
    for (const file of req.files) {
      const filePath = path.join(newFolder.folder_url, file.originalname);

      // Move file to folder path
      fs.renameSync(file.path, filePath);

      // Create file entry
      await File.create({
        name: file.originalname,
        folderId: newFolder.id,
      });
    }

    res.status(201).send("Folder uploaded successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading folder.");
  }
};
const crteateFolderC=(req,res)=>{
  const {parentFolder,folder_url, folder_name}=req.body
  const folder=  createFolder(parentFolder,folder_url, folder_name)
  if(!folder){
    
  }
  // createfolder

}
const uploadFile = async (req, res) => {
  console.log("hello");
  try {
    //   const user = await User.findByPk(req.body.user_id);
    const folder = await Folder.findByPk(req.body.folder_id);

    const newFile = await createFile(req.file, folder);
    // await user.addFile(newFile);

    res.status(201).send("File uploaded successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file.");
  }
};

module.exports = { uploadFolderC, uploadFile };
