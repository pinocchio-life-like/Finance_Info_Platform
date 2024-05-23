const {Folder}=require('./FolderModel')
const {File}=require('./FileModel')
const{User}=require('../userModel')

Folder.hasMany(File,{ foreignKey: 'folder_id' })
File.belongsTo(Folder, { foreignKey: 'folder_id' });
Folder.belongsToMany(User, { through: "FolderUser" });
User.belongsToMany(Folder, { through: "FolderUser" });
