const { getallversionsOFAnArticle, getVersionById: fetchVersionById } = require("../models/articleVersionModel");
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
const getVersionByIdController = async (req, res) => {
  try {
    // Make sure to match the parameter name with your route definition
    const { versionId } = req.params;
    const version = await fetchVersionById(versionId);
    if (!version) {
      return res.status(404).json({ message: "Version not found" });
    } else {
      return res.json(version);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error while fetching version",
    });
  }
};


module.exports = { versionController, getVersionById: getVersionByIdController};