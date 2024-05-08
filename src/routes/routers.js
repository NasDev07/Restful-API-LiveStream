const express = require("express");
const router = express.Router();

const dataImageController = require("../controller/uploadsImage");
const getAllImageController = require("../controller/getAllImage");
const sigleImageController = require("../controller/sigleImage");

const uploadDataFile = require("../controller/uploadFile");
const getAllFile = require("../controller/getAllFile");

// Endpoint untuk image
router.post("/photo", dataImageController.uploadPhoto);
router.get("/photos", getAllImageController.getAllPhoto);
router.get("/photos-single", sigleImageController.sigleImage);

// Endpoint untuk mengunggah file
// Import middleware multer yang telah dikonfigurasi sebelumnya
const { uploads } = require("../controller/uploadFile");
router.post("/file", uploads.single("file"), uploadDataFile.uploadFile);
router.get("/files", getAllFile.getAllFile);

module.exports = router;
