const fs = require("fs");
const chokidar = require("chokidar");

const singleFile = (req, res, next) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "http://localhost:5173",
  });

  // Inisialisasi chikidar untuk memantau perubahan dalam direktori uploads
  const watcher = chokidar.watch("uploads/file", {
    ignoreInitial: true,
    persistent: true,
  });

  const sendLatestFile = () => {
    try {
      const files = fs.readdirSync("uploads/file");
      if (files.length === 0) {
        // jika tidak ada foto yang tersedia, kirim pesan kosong
        res.write(`data: ${JSON.stringify({ file: null })}\n\n`);
      } else {
        let latestFile = files[files.length - 1]; // ambil fle dengan ID ter-ahkir

        const stats = fs.statSync(`uploads/file/${latestFile}`);
        let fileData = {
          id: latestFile.split("_")[0],
          filename: `http://localhost:3000/uploads/file/${latestFile}`,
          size: stats.size,
          lastModified: stats.mtime,
        };

        res.write(`data: ${JSON.stringify({ file: fileData })}\n\n`);
      }
    } catch (err) {
      console.log("Error sending file data: " + err);
      res.end();
    }
  };

  // panggil sendLatesFile saat aplikasi pertama kai di jalankan
  sendLatestFile();

  // panggil sendLatestFile saat ada perubahan dalam direktori uploads
  watcher.on("all", sendLatestFile);

  // Tangani penutupan koneksi dari klien
  req.on("close", () => {
    watcher.close();
    res.end();
  });
};

module.exports = { singleFile };
