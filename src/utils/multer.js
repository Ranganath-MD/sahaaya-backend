const multer = require("multer");
const path = require("path");
// configure multer
// const storage = multer.diskStorage({
//   destination: (_, __, cb) => {
//     cb(null, './src/uploads');
//   },
//   filename: function (_, file, cb) {
//     cb(null, Date.now() + file.originalname);
//   },
// });
const storage = multer.diskStorage({});

const fileFilter = (_, file, cb) => {
  let ext = path.extname(file.originalname);
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".svg") {
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
