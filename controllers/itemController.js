const { body, validationResult } = require('express-validator');

const Item = require('../models/item');
const Category = require('../models/category');

exports.item_list = async (req, res) => {
  const items = await Item.find({}).populate('category');
  res.render('item_list', { title: 'All items Algo1', items });
};

exports.item_detail = async (req, res) => {
  const item = await Item.findById(req.params.id).populate('category');
  res.render('item_detail', { title: item.name, item });
};

exports.item_create_get = async (req, res) => {
  const categories = await Category.find({});
  res.render('item_form', { title: 'Add new item', categories });
};

exports.item_create_post = [
  body('name').exists({ checkFalsy: true }).trim().escape(),
  body('description').exists({ checkFalsy: true }).trim().escape(),
  body('price')
    .exists({ checkFalsy: true })
    .trim()
    .escape()
    .isDecimal({ decimal_digits: '2' }),
  body('numberInStock')
    .exists({ checkFalsy: true })
    .trim()
    .escape()
    .isInt({ min: 0 }),

  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    // eslint-disable-next-line object-curly-newline
    const { name, description, category, price, numberInStock } = req.body;

    const item = new Item({
      name,
      description,
      category,
      price,
      numberInStock,
      imageFilename: req.file.filename,
    });

    if (!errors.isEmpty()) {
      // Validation errors. Rerender form with immediate validation
      const categories = await Category.find({});
      res.render('item_form', {
        title: 'New Item',
        item,
        categories,
        setCategory: true,
        validate: true,
      });
    } else {
      // Data is valid, save
      await item.save();
      res.redirect(item.url);
    }
  },
];

exports.item_delete_get = async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.render('item_delete', { title: `Delete ${item.name}`, item });
};

exports.item_delete_post = async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect('/inventory/items');
};

exports.item_update_get = async (req, res) => {
  const item = await Item.findById(req.params.id);
  const categories = await Category.find({});

  res.render('item_form', {
    title: `Update ${item.name}`,
    item,
    categories,
    setCategory: true,
  });
};

exports.item_update_post = [
  body('name').exists({ checkFalsy: true }).trim().escape(),
  body('description').exists({ checkFalsy: true }).trim().escape(),
  body('price')
    .exists({ checkFalsy: true })
    .trim()
    .escape()
    .isDecimal({ decimal_digits: '2' }),
  body('numberInStock')
    .exists({ checkFalsy: true })
    .trim()
    .escape()
    .isInt({ min: 0 }),

  async (req, res) => {
    const errors = validationResult(req);
    // eslint-disable-next-line object-curly-newline
    const { name, description, category, price, numberInStock } = req.body;

    const item = new Item({
      name,
      description,
      category,
      price,
      numberInStock,
      imageFilename: req.file.filename,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // Validation errors. Rerender form with immediate validation
      const categories = await Category.find({});
      res.render('item_form', {
        title: `Update ${item.name}`,
        item,
        categories,
        setCategory: true,
        validate: true,
      });
    } else {
      // Data is valid, save
      await Item.findByIdAndUpdate(req.params.id, item);
      res.redirect(item.url);
    }
  },
];
