const multer = require("multer");
const fs = require("fs");
const path = require("path");

const upload = multer({ dest: "uploads/image/" });

let nextId = 1;

function uploadPhoto(req, res, next) {
  upload.single("photo")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: "File is too large" });
    } else if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }

    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const id =
        nextId > 1 ? nextId : fs.readdirSync("uploads/image").length + 1;
      nextId = id + 1;

      const filename = `${id}_${file.originalname}`;
      fs.renameSync(file.path, path.join("uploads/image", filename));

      const uploadedFile = {
        id: id,
        filename: filename,
        size: file.size,
        mimetype: file.mimetype,
      };

      res.status(200).json(uploadedFile);
    } catch (err) {
      console.error("Error uploading photo:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}

module.exports = { uploadPhoto };
