#! /usr/bin/env node
/* eslint-disable comma-dangle */
/* eslint-disable func-names */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
require('dotenv').config();
var async = require('async');
var mongoose = require('mongoose');
var Unidades = require('./models/unidades');

var mongoDB = process.env.MONGODB_URI;
mongoose.connect('mongodb+srv://laura:laura1981@cluster0.xuvtr.mongodb.net/Inventario?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var unidad_list = [];


function UnidadCrear(descripcion, cb){

  var unidad_row = new Unidades({
    descripcion
  });

  unidad_row.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`nueva unidad: ${unidad_row}`);
    unidad_list.push(unidad_row);
    cb(null, unidad_list);
  });

}

function rellenarUnidad(cb) {
  async.series(
    [
      function (callback) {
        UnidadCrear(
          'gr',
          callback
        );
      },
      function (callback) {
        UnidadCrear(
          'unidad',
          callback
        );
      },
      function (callback) {
        UnidadCrear(
          'cc',
          callback
        );
      },
    ],
    cb
  );
}



async.series(
  [rellenarUnidad],
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
