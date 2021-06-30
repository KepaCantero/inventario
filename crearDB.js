#! /usr/bin/env node
/* eslint-disable comma-dangle */
/* eslint-disable func-names */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
require('dotenv').config();
var async = require('async');
var mongoose = require('mongoose');
var Item = require('./models/item');
var Category = require('./models/category');
var Inventario = = require('./models/Inventario');

var mongoDB = process.env.MONGODB_URI;
mongoose.connect('mongodb://localhost:27017/User', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = [];
var items = [];
var inventario = [];


function InventarioCreate(insumo, stock, entradas, salidas, cb){

  var inventario = new Inventario({
    insumo,
    stock,
    entradas,
    salidas
  });

  inventario.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Inventario: ${Inventario}`);
    inventario.push(inventario);
    cb(null, inventario);
  });

}


function categoryCreate(name, description, donut, cb) {
  var category = new Category({
    name,
    description,
    donut,
  });

  category.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Category: ${category}`);
    categories.push(category);
    cb(null, category);
  });
}

function itemCreate(name, description, category, price, numberInStock, cb) {
  const itemDetail = {
    name,
    description,
    category,
    price,
    numberInStock,
  };

  var item = new Item(itemDetail);
  item.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Item: ${item}`);
    items.push(item);
    cb(null, item);
  });
}
function rellenarFormulario(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate(
          'Avena',
          10000,
          0,
          0,
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Datil',
          5000,
          0,
          0,
          callback
        );
      },

    ],
    cb
  );
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate(
          'Donuts',
          'Anything fried with a hole in it, excluding bagels',
          true,
          callback
        );
      },
      function (callback) {
        categoryCreate('Scones', 'Stale donuts without holes', true, callback);
      },
      function (callback) {
        categoryCreate(
          'Long Johns',
          'Rectangular donuts without holes',
          true,
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Rolls',
          'Cinnamon or caramel, for example',
          true,
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Beverages',
          'Wash it down with a coffee or water!',
          false,
          callback
        );
      },
    ],
    cb
  );
}

function createItems(cb) {
  async.parallel(
    [
      function (callback) {
        itemCreate(
          'Old fashioned',
          'Sour cream cake donut',
          categories[0],
          '1.29',
          50,
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Classic chocolate',
          'Cake donut with chocolate frosting',
          categories[0],
          '1.09',
          25,
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Glazed Raised',
          'Raised donut with delicate glaze',
          categories[0],
          '1.09',
          50,
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Classic',
          'Plain cake donut',
          categories[0],
          '0.99',
          50,
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Raspberry scone',
          'Scone with real raspberry pieces',
          categories[1],
          '1.99',
          10,
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Chocolate long john',
          'Long John with chocolate icing',
          categories[2],
          '1.99',
          30,
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Bear claw',
          'A long donut with frosting and a bear claw shape on the end',
          categories[2],
          '2.19',
          10,
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Caramel roll',
          'A gooey roll of caramel',
          categories[3],
          '1.99',
          40,
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Cinnamon roll',
          'A gooey roll of cinnamon. Customer favorite!',
          categories[3],
          '1.99',
          40,
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Coffee',
          'Freshly brewed Colombian coffee',
          categories[4],
          '0.99',
          40,
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Water',
          'Bottled water',
          categories[4],
          '1.49',
          100,
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Orange juice',
          'Bottled Floridian Orange Juice',
          categories[4],
          '1.99',
          18,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createCategories, createItems],
  // Optional callback
  (err) => {
    if (err) {
      console.log(`FINAL ERR: ${err}`);
    } else {
      console.log('All done! check mongo');
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
