const express = require('express');
const multer = require('multer');
const { fileFilter, itemStorage, limits } = require('../utils/multer');
const itemController = require('../controllers/itemController');

const upload = multer({ storage: itemStorage, limits, fileFilter });
const router = express.Router();

router.get('/', itemController.item_list);

router.get('/create', itemController.item_create_get);
router.post('/create', upload.single('image'), itemController.item_create_post);

router.get('/:id', itemController.item_detail);

router.get('/:id/delete', itemController.item_delete_get);
router.post('/:id/delete', itemController.item_delete_post);

router.get('/:id/update', itemController.item_update_get);
router.post(
  '/:id/update',
  upload.single('image'),
  itemController.item_update_post
);

module.exports = router;
