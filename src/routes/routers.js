const express = require("express");
const router = express.Router();

const dataImageController = require("../controller/uploadsImage");
const getAllImageController = require("../controller/getAllImage");
const sigleImageController = require("../controller/sigleImage");

const uploadDataFileController = require("../controller/uploadFile");
const getAllFileController = require("../controller/getAllFile");
const sigleFileController = require("../controller/sigleFile");

// Endpoint untuk image
router.post("/photo", dataImageController.uploadPhoto);
router.get("/photos", getAllImageController.getAllPhoto);
router.get("/photos-single", sigleImageController.sigleImage);

// Endpoint untuk mengunggah file
// Import middleware multer yang telah dikonfigurasi sebelumnya
const { uploads } = require("../controller/uploadFile");
router.post(
  "/file",
  uploads.single("file"),
  uploadDataFileController.uploadFile
);
router.get("/files", getAllFileController.getAllFile);
router.get("/files-single", sigleFileController.singleFile);

module.exports = router;
