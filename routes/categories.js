const express = require('express');
const multer = require('multer');
const { fileFilter, categoryStorage, limits } = require('../utils/multer');
const categoryController = require('../controllers/categoryController');

const upload = multer({ storage: categoryStorage, limits, fileFilter });
const router = express.Router();

router.get('/', categoryController.category_list);

router.get('/create', categoryController.category_create_get);
router.post(
  '/create',
  upload.single('image'),
  categoryController.category_create_post
);

router.get('/:id', categoryController.category_detail);

router.get('/:id/delete', categoryController.category_delete_get);
router.post('/:id/delete', categoryController.category_delete_post);

router.get('/:id/update', categoryController.category_update_get);
router.post(
  '/:id/update',
  upload.single('image'),
  categoryController.category_update_post
);

module.exports = router;
