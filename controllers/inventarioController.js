const {
  body,
  validationResult
} = require('express-validator');

const InventarioSchema = require('../models/inventario');

exports.item_list = async (req, res) => {
  const items = InventarioSchema.find({})
  .lean()
  .exec(function (err, items) {
    items.forEach(function (item, index) {
      items[index].empty_stock = (items[index].stock <=0);
      items[index].url = "/inventario/" + items[index]._id;
      })
      res.render('inventario_list', {
        title: 'Productos actualmente in Stock',
        items
    });
  })

};


exports.inventario_create_get = async (req, res) => {
  res.render('inventario_form', {
      title: 'Añadir nuevo Insumo'
  });
};

exports.insumo_detail = async (req, res) => {
  const item = await InventarioSchema.findById(req.params.id);
  res.render('insumo_detail', {
      title: item.insumo,
      item
  });
};



exports.inventario_create_post = [
  body('insumo').exists({
      checkFalsy: true
  }).trim().escape(),

  body('salidas')
  .exists({
      checkFalsy: true
  })
  .trim()
  .escape()
  .isInt({
      min: 0
  }),

  body('entradas')
  .exists({
      checkFalsy: true
  })
  .trim()
  .escape()
  .isInt({
      min: 0
  }),

  body('stock')
  .exists({
      checkFalsy: true
  })
  .trim()
  .escape()
  .isInt({
      min: 0
  }),

  async (req, res) => {
      const errors = validationResult(req);
      console.log(errors);
      // eslint-disable-next-line object-curly-newline
      const {
          insumo,
          stock,
          entradas,
          salidas
      } = req.body;
      const item = new InventarioSchema({
          insumo,
          stock,
          entradas,
          salidas,
      });
      if (!errors.isEmpty()) {
          // Validation errors. Rerender form with immediate validation
          const categories = await Category.find({});
          res.render('inventario_form', {
              title: 'New Item',
              item
          });
      } else {
          // Data is valid, save
          await item.save();
          res.redirect(item.url);
      }
  },
];
exports.insumo_update_get = async (req, res) => {

  const item = await InventarioSchema.findById(req.params.id);
  res.render('inventario_form', {
      title: `Update ${item.name}`,
      item
  });
};

exports.insumo_update_post = [
  body('insumo').exists({
      checkFalsy: true
  }).trim().escape(),
  body('salidas')
  .exists({
      checkFalsy: true
  })
  .trim()
  .escape()
  .isInt({
      min: 0
  }),

  body('entradas')
  .exists({
      checkFalsy: true
  })
  .trim()
  .escape()
  .isInt({
      min: 0
  }),

  body('stock')
  .exists({
      checkFalsy: true
  })
  .trim()
  .escape()
  .isInt({
      min: 0
  }),

  async (req, res) => {
      const errors = validationResult(req);
      console.log(errors);
      // eslint-disable-next-line object-curly-newline
      const {
          insumo,
          stock,
          entradas,
          salidas
      } = req.body;
      const item = new InventarioSchema({
          insumo: insumo,
          stock: stock,
          entradas: entradas,
          salidas: salidas,
          _id: req.params.id,
      });
      if (!errors.isEmpty()) {
        // Validation errors. Rerender form with immediate validation
        res.render('inventario_form', {
          title: `Update ${item.name}`,
          item,
        });
      } else {
        // Data is valid, save
        await InventarioSchema.findByIdAndUpdate(req.params.id, item);
        res.redirect(item.url);
      }

  },
];


exports.insumo_delete_get = async (req, res) => {
  const item = await InventarioSchema.findById(req.params.id);
  res.render('insumo_delete', {
      title: `Delete ${item.insumo}`,
      item
  });
};

exports.insumo_delete_post = async (req, res) => {
  await InventarioSchema.findByIdAndDelete(req.params.id);
  res.redirect('/inventario');
};
