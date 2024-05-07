const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Konfigurasi multer dengan filter untuk menolak tipe file gambar
const uploads = multer({
  dest: "uploads/file/",
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/pdf", // .pdf
      "application/zip", // .zip
      "application/xml", // .xml
      "text/xml", // .xml
    ];

    if (allowedTypes.includes(file.mimetype)) {
      // Jika tipe file diperbolehkan, lanjutkan proses upload
      cb(null, true);
    } else {
      // Jika tipe file tidak diperbolehkan, tolak uploadnya
      cb(new Error("Only Word, Excel, PDF, ZIP, and XML files are allowed"));
    }
  },
});

// Endpoint untuk mengunggah file
function uploadFile(req, res, next) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Dapatkan ID terbaru dengan menghitung jumlah file di dalam direktori "uploads/file"
    const filesInDirectory = fs.readdirSync("uploads/file");
    const id = filesInDirectory.length > 0 ? filesInDirectory.length + 1 : 1;

    const filename = `${id}_${file.originalname}`;

    // Pindahkan file yang diunggah ke direktori "uploads/file"
    fs.rename(file.path, path.join("uploads/file", filename), (err) => {
      if (err) {
        console.error("Error moving file:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      const uploadedFile = {
        id: id,
        filename: filename,
        size: file.size,
        mimetype: file.mimetype,
      };

      // Kirim respons dengan data file yang diunggah
      res.status(200).json(uploadedFile);
    });
  } catch (err) {
    console.error("Error uploading file:", err);
    // Tangani kesalahan upload, jika ada
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ error: "File is too large" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = { uploadFile, uploads };
