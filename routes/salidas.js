const express = require('express');
const multer = require('multer');
const { fileFilter, itemStorage, limits } = require('../utils/multer');
const salidasController = require('../controllers/salidasController');

const upload = multer({ storage: itemStorage, limits, fileFilter });
const router = express.Router();

router.get('/create', salidasController.salidas_create_get);
router.get('/', salidasController.salidas_list);
router.post('/create', upload.single('image'), salidasController.salida_create_post);
router.get('/:id', salidasController.salida_detail);
router.get('/:id/delete', salidasController.salida_delete_get);
router.post('/:id/delete', salidasController.salida_delete_post);


router.get('/:id/update', salidasController.salida_update_get);

module.exports = router;
