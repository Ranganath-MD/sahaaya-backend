const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({});
const supportedFormats = [".jpg", ".jpeg", ".png", ".svg", ".JPG", ".JPEG", ".PNG", ".SVG"]
const fileFilter = (_, file, cb) => {
  let ext = path.extname(file.originalname);
  console.log(ext)
  if (!supportedFormats.includes(ext)) {
    cb(new Error("File type is not supported"), false);
    return;
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
}).single("image");

module.exports = {
  upload,
};
