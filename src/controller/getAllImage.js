const fs = require("fs");

const getAllPhoto = (req, res, next) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "http://localhost:5173", // Izinkan akses dari aplikasi React
  });

  const intervalId = setInterval(() => {
    try {
      const files = fs.readdirSync("uploads/image");
      let photoData = files.map((file) => {
        const stats = fs.statSync(`uploads/image/${file}`);
        return {
          id: file.split("_")[0],
          filename: `http://localhost:3000/uploads/image/${file}`,
          size: stats.size,
          lastModified: stats.mtime,
        };
      });

      // Urutkan photoData berdasarkan lastModified secara descending
      photoData.sort((a, b) => b.lastModified - a.lastModified);

      res.write(`data: ${JSON.stringify({ photos: photoData })}\n\n`);
    } catch (err) {
      console.error("Error sending photo data:", err);
      clearInterval(intervalId);
      res.end();
    }
  });

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
};

module.exports = { getAllPhoto };
