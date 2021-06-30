const multer = require('multer');
const uniqid = require('uniqid');

exports.fileFilter = function fileFilter(req, file, cb) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid filetype. JPG or PNG accepted.'));
  }
};

exports.limits = {
  fileSize: 5000000,
  files: 1,
};

const filename = (req, file, cb) => {
  let extension;
  if (file.mimetype === 'image/jpeg') {
    extension = 'jpg';
  } else if (file.mimetype === 'image/png') {
    extension = 'png';
  } else {
    cb(new Error('Invalid filetype'));
  }
  cb(null, `${uniqid()}.${extension}`);
};

exports.categoryStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/images/categories/');
  },
  filename,
});

exports.itemStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/images/items/');
  },
  filename,
});
