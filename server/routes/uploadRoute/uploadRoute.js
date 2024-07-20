const router = require("express").Router();
const {
  uploadFile,
  findAllFiles,
  deleteFile,
} = require("../../models/UploadModel/UploadModel");

const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const multer = require("multer");
const path = require("path");

const imgStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = "./Article/Images/";
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        path.extname(
          (file.originalname = Buffer.from(
            file.originalname,
            "latin1"
          ).toString("utf8"))
        )
    ); //Appending extension
  },
});

const imgUpload = multer({ storage: imgStorage });

router.post("/article/img/upload", imgUpload.array("file"), (req, res) => {
  try {
    const urls = req.files.map((file) => {
      return `${req.protocol}://${req.get("host")}/Article/Images/${
        file.filename
      }`;
    });
    res.status(200).json({ urls });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = "./Article/Files/";
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        path.extname(
          (file.originalname = Buffer.from(
            file.originalname,
            "latin1"
          ).toString("utf8"))
        )
    ); //Appending extension
  },
});

const articleUpload = multer({ storage: fileStorage });

router.post(
  "/article/file/upload",
  articleUpload.array("files"),
  async (req, res) => {
    const files = req.files;
    const user = req.body.user;
    const category_Id = req.body.category_Id;

    if (!files) {
      return res.status(400).send("No files were uploaded.");
    }

    const uploads = files.map((file) => {
      const url = `${req.protocol}://${req.get("host")}/Article/Files/${
        file.filename
      }`;
      return {
        url: url,
        type: file.mimetype,
        user,
        category_Id,
        originalname: file.originalname,
      };
    });

    try {
      const results = await Promise.all(uploads.map(uploadFile));
      res.send(results);
    } catch (error) {
      console.error("Error saving to database:", error);
      res.status(500).send("Error saving file information");
    }
  }
);

router.get("/article/file/:category_Id", async (req, res) => {
  const category_Id = req.params.category_Id;

  try {
    const uploads = await findAllFiles(category_Id);

    res.send(uploads);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).send("Error fetching files");
  }
});

router.delete("/article/file/delete/", async (req, res) => {
  try {
    const url = req.body.key;
    const filename = path.basename(url);
    const filePath = path.join(__dirname, `../../Article/Files/${filename}`);
    console.log("Deleting file:", filePath);
    await unlinkAsync(filePath);
    await deleteFile(url);
    res.status(200).send({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).send({ error: error.toString() });
  }
});

module.exports = router;
