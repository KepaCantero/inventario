#! /usr/bin/env node
/* eslint-disable comma-dangle */
/* eslint-disable func-names */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
require('dotenv').config();
var async = require('async');
var mongoose = require('mongoose');
var User = require('./models/user');


var mongoDB = process.env.MONGODB_URI;
mongoose.connect('mongodb://localhost:27017/server', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = [];



function userCreate(username, password){

  var user = new User({
    username,
    password
  });

  user.save((err) => {
    if (err) {
    console.info(err);
      return;
    }
    console.log(`New Inventario: ${user}`);
  });

}


function createUsuario() {
  userCreate(
    'kepa',
    'kepa'
    );
}



async.series(
  [createUsuario],
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
