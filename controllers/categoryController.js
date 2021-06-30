const { body, validationResult } = require('express-validator');

const Category = require('../models/category');
const Item = require('../models/item');

exports.category_list = async (req, res) => {
  const categories = await Category.find({});
  res.render('category_list', { title: 'All categories', categories });
};

exports.category_detail = async (req, res) => {
  const category = await Category.findById(req.params.id);
  const items = await Item.find({ category: req.params.id });
  res.render('category_detail', { title: category.name, category, items });
};

exports.category_create_get = (req, res) => {
  res.render('category_form', { title: 'New Category algo' });
};

exports.category_create_post = [
  body('name').exists({ checkFalsy: true }).trim().escape(),
  body('description').exists({ checkFalsy: true }).trim().escape(),

  async (req, res) => {
    const errors = validationResult(req);

    let donut;

    if (req.body.donut) {
      donut = true;
    } else {
      donut = false;
    }

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      donut,
      imageFilename: req.file.filename,
    });

    if (!errors.isEmpty()) {
      // Validation errors. Rerender form with immediate validation
      res.render('category_form', {
        title: 'New Category',
        category,
        validate: true,
      });
    } else {
      // Data is valid, save
      await category.save();
      res.redirect(category.url);
    }
  },
];

exports.category_delete_get = async (req, res) => {
  const category = await Category.findById(req.params.id);
  const items = await Item.find({ category });

  res.render('category_delete', {
    title: `Delete ${category.name}`,
    category,
    items,
  });
};

exports.category_delete_post = async (req, res) => {
  const category = await Category.findById(req.params.id);
  const items = await Item.find({ category });

  if (items && items.length) {
    res.redirect(`${category.url}/delete`);
  } else {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/inventory/categories');
  }
};

exports.category_update_get = async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.render('category_form', { title: `Update ${category.name}`, category });
};

exports.category_update_post = [
  body('name').exists({ checkFalsy: true }).trim().escape(),
  body('description').exists({ checkFalsy: true }).trim().escape(),

  async (req, res) => {
    const errors = validationResult(req);

    let donut;

    if (req.body.donut) {
      donut = true;
    } else {
      donut = false;
    }

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      donut,
      imageFilename: req.file.filename,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // Validation errors. Rerender form with immediate validation
      res.render('category_form', {
        title: `Update ${category.name}`,
        category,
        validate: true,
      });
    } else {
      // Data is valid, save
      await Category.findByIdAndUpdate(req.params.id, category);
      res.redirect(category.url);
    }
  },
];
