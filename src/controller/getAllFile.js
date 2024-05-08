const fs = require("fs");

const getAllFile = (req, res, next) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "http://localhost:5173",
  });

  const intervalId = setInterval(() => {
    try {
      const files = fs.readdirSync("uploads/file");
      let fileData = files.map((file) => {
        const stats = fs.statSync(`uploads/file/${file}`);
        return {
          id: file.split("_")[0],
          filename: `http://localhost:3000/uploads/file/${file}`,
          size: stats.size,
          lastModified: stats.mtime,
        };
      });

      // Urutkan fileData berdasarkan lastModifid secara descending
      fileData.sort((a, b) => b.lastModified - a.lastModified);

      res.write(`data: ${JSON.stringify({ files: fileData })}\n\n`);
    } catch (err) {
      console.log("Error sending file data:", err);
      clearInterval(intervalId);
      res.end();
    }
  });

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
};

module.exports = { getAllFile };
