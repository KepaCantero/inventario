#! /usr/bin/env node
/* eslint-disable comma-dangle */
/* eslint-disable func-names */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
require('dotenv').config();
var async = require('async');
var mongoose = require('mongoose');
var InventarioSchema = require('./models/inventario');

var mongoDB = process.env.MONGODB_URI;
mongoose.connect('mongodb://localhost:27017/server', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var unidad_list = [];


function InsumoCrear(insumo, stock, entradas, salidas, unidad, cb){

const item = new InventarioSchema({
    insumo,
    stock,
    entradas,
    salidas,
    unidad
});


item.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`nueva unidad: ${item}`);
    unidad_list.push(item);
    cb(null, item);
  });

}

function rellenarInsumo(cb) {
  async.series(
    [
      function (callback) {
        InsumoCrear(
          'avena',
          10000,
          0,
          0,
          '60cdb50e6698fb7b9ff79ca4',
          callback
        );
      },function (callback) {
        InsumoCrear(
          'datil',
          10000,
          0,
          0,
          '60cdb50e6698fb7b9ff79ca4',
          callback
        );
      },function (callback) {
        InsumoCrear(
          'mani sin sal',
          10000,
          0,
          0,
          '60cdb50e6698fb7b9ff79ca4',
          callback
        );
      },function (callback) {
        InsumoCrear(
          'etiqueta barra',
          1000,
          0,
          0,
          '60cdb50e6698fb7b9ff79ca5',
          callback
        );
      },function (callback) {
        InsumoCrear(
          'etiqueta inf nutri',
          1000,
          0,
          0,
          '60cdb50e6698fb7b9ff79ca5',
          callback
        );
      },function (callback) {
        InsumoCrear(
          'coco rallada',
          10000,
          0,
          0,
          '60cdb50e6698fb7b9ff79ca4',
          callback
        );
      },function (callback) {
        InsumoCrear(
          'coco laminado',
          10000,
          0,
          0,
          '60cdb50e6698fb7b9ff79ca4',
          callback
        );
      },function (callback) {
        InsumoCrear(
          'agave',
          10000,
          0,
          0,
          '60cdb50e6698fb7b9ff79ca4',
          callback
        );
      },function (callback) {
        InsumoCrear(
          'chocolate vegano',
          10000,
          0,
          0,
          '60cdb50e6698fb7b9ff79ca4',
          callback
        );
      },
      function (callback) {
        InsumoCrear(
          'avellanas',
          10000,
          0,
          0,
          '60cdb50e6698fb7b9ff79ca4',
          callback
        );
      },
      function (callback) {
        InsumoCrear(
          'vainilla',
          10000,
          0,
          0,
          '60cdb50e6698fb7b9ff79ca4',
          callback
        );
      },
      function (callback) {
        InsumoCrear(
          'agave',
          10000,
          0,
          0,
          '60cdb50e6698fb7b9ff79ca4',
          callback
        );
      },
      function (callback) {
        InsumoCrear(
          'cacao',
          10000,
          0,
          0,
          '60cdb50e6698fb7b9ff79ca4',
          callback
        );
      },
      function (callback) {
        InsumoCrear(
          'chocolate',
          10000,
          0,
          0,
          '60cdb50e6698fb7b9ff79ca4',
          callback
        );
      },
      function (callback) {
        InsumoCrear(
          'frasco 380cc',
          1000,
          0,
          0,
          '60cdb50e6698fb7b9ff79ca5',
          callback
        );
      },
    ],
    cb
  );
}



async.series(
  [rellenarInsumo],
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
