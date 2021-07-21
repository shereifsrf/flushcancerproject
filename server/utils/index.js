const multer = require("multer");

// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads");
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname))
//     },
// });

// exports.upload = multer({ storage: storage });
var storage = multer.memoryStorage();
exports.upload = multer({ storage: storage });
