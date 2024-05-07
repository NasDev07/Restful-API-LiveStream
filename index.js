const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.static("public")); // Mengatur folder 'public' agar dapat diakses secara publik
app.use(cors()); // Gunakan middleware cors
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Menyajikan file gambar secara publik dari direktori 'uploads'

const uploadImagesRouter = require("./src/routes/routers");
app.use("/", uploadImagesRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
