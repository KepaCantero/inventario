const express = require('express');
const multer = require('multer');
const { fileFilter, itemStorage, limits } = require('../utils/multer');
const inventarioController = require('../controllers/inventarioController');

const upload = multer({ storage: itemStorage, limits, fileFilter });
const router = express.Router();

router.get('/create', inventarioController.inventario_create_get);
router.get('/:id', inventarioController.insumo_detail);
router.get('/', inventarioController.item_list);
router.post(
    '/create',
    upload.single('image'),
    inventarioController.inventario_create_post
  );

router.get('/:id/delete', inventarioController.insumo_delete_get);
router.post('/:id/delete', inventarioController.insumo_delete_post);

router.get('/:id/update', inventarioController.insumo_update_get);
router.post(
    '/:id/update',
    upload.single('image'),
    inventarioController.insumo_update_post
);


module.exports = router;

