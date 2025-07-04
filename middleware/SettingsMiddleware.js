const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    cb(null, 'logo_' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

module.exports = upload;