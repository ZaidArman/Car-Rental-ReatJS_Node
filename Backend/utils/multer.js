const multer = require("multer");
const path = require("path");

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where the files will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Set up file filter and limits
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      console.log("images.......");
      cb(null, true);
    } else {
      cb(new Error("You can upload only images"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB (adjust the limit as needed)
  },
});

module.exports = { upload };
