const fs = require("fs");
const chokidar = require("chokidar"); // Tambahkan ini untuk menggunakan chokidar

function sigleImage(req, res, next) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "http://localhost:5173", // Izinkan akses dari aplikasi React
  });

  // Inisialisasi chokidar untuk memantau perubahan dalam direktori 'uploads'
  const watcher = chokidar.watch("uploads/image", {
    ignoreInitial: true, // Jangan kirim perubahan saat aplikasi pertama kali dijalankan
    persistent: true,
  });

  // Fungsi untuk mengirimkan data foto terbaru ke klien
  const sendLatestPhoto = () => {
    try {
      const files = fs.readdirSync("uploads/image");
      if (files.length === 0) {
        // Jika tidak ada foto yang tersedia, kirim pesan kosong
        res.write(`data: ${JSON.stringify({ photo: null })}\n\n`);
      } else {
        let latestFile = files[files.length - 1]; // Ambil file dengan ID terakhir

        const stats = fs.statSync(`uploads/image/${latestFile}`);
        let photoData = {
          id: latestFile.split("_")[0],
          filename: `http://localhost:3000/uploads/image/${latestFile}`,
          size: stats.size,
          lastModified: stats.mtime,
        };

        res.write(`data: ${JSON.stringify({ photo: photoData })}\n\n`);
      }
    } catch (err) {
      console.error("Error sending photo data:", err);
      res.end();
    }
  };

  // Panggil sendLatestPhoto saat aplikasi pertama kali dijalankan
  sendLatestPhoto();

  // Panggil sendLatestPhoto saat ada perubahan dalam direktori 'uploads'
  watcher.on("all", sendLatestPhoto);

  // Tangani penutupan koneksi dari klien
  req.on("close", () => {
    watcher.close();
    res.end();
  });
}

module.exports = { sigleImage };
