const express = require('express');
const multer = require('multer');
const { fileFilter, itemStorage, limits } = require('../utils/multer');
const recetasController = require('../controllers/recetasController');

const upload = multer({ storage: itemStorage, limits, fileFilter });
const router = express.Router();

router.get('/create', recetasController.recetas_create_get);
router.get('/', recetasController.recetas_list);

router.get('/:id', recetasController.receta_detail);

router.post(
    '/create',
    upload.single('image'),
    recetasController.receta_create_post
  );

router.get('/:id/delete', recetasController.receta_delete_get);
router.post('/:id/delete', recetasController.receta_delete_post);


router.get('/:id/update', recetasController.receta_update_get);


module.exports = router;
