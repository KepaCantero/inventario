const express = require('express');
const multer = require('multer');
const { fileFilter, itemStorage, limits } = require('../utils/multer');
const entradasController = require('../controllers/entradasController');

const upload = multer({ storage: itemStorage, limits, fileFilter });
const router = express.Router();

router.get('/create', entradasController.entradas_create_get);
router.get('/', entradasController.entradas_list);
router.post('/create', upload.single('image'), entradasController.entrada_create_post);
router.get('/:id', entradasController.entrada_detail);
router.get('/:id/delete', entradasController.entrada_delete_get);
router.post('/:id/delete', entradasController.entrada_delete_post);


router.get('/:id/update', entradasController.entrada_update_get);

module.exports = router;
