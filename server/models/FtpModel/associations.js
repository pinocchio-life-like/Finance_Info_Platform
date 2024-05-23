const {Folder}=require('./FolderModel')
const {File}=require('./FileModel')

Folder.hasMany(File,{ foreignKey: 'folder_id' })
File.belongsTo(Folder, { foreignKey: 'folder_id' });
