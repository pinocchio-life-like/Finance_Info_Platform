const { getallversionsOFAnArticle } = require("../models/articleVersionModel");
const versionController = async (req, res) => {
  try {
    const { id } = req.params;
    const versions = await getallversionsOFAnArticle(id);
    if (!versions || versions.length === 0) {
      return res.json({ message: "No versions found" });
    } else {
      return res.json({
        message: "These are the existing versions",
        data: versions,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error from version controller",
    });
  }
};

module.exports = { versionController };
