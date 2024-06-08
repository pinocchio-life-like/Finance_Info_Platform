const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");
const { File } = require("../models/FtpModel/FileModel");
const { FolderUser } = require("../models/FtpModel/FolderUserModel");

const verifyFileUserMiddleware = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(403).json({ message: "Access Denied" });
  }

  try {
    const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const { userName } = verified;

    // Get userId using userName
    const user = await User.findOne({ where: { userName } });
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    // Get fileId using file_url
    const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    const decodedFullPath = decodeURI(fullUrl);
    const file = await File.findOne({ where: { file_url: decodedFullPath } });
    if (!file) {
      return res.status(403).json({ message: "File not found" });
    }

    // Check if user has access to the file
    const folderUser = await FolderUser.findOne({
      where: { userId: user.userId, folder_id: file.folder_id },
    });

    if (!folderUser) {
      return res.status(403).json({ message: "Access Denied" });
    }

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};

module.exports = verifyFileUserMiddleware;
