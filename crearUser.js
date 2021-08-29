#! /usr/bin/env node
/* eslint-disable comma-dangle */
/* eslint-disable func-names */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
require('dotenv').config();
var async = require('async');
var mongoose = require('mongoose');
const item = require('./models/item');
var User = require('./models/user');


var mongoDB = process.env.MONGODB_URI;
mongoose.connect('mongodb+srv://laura:laura1981@cluster0.xuvtr.mongodb.net/Inventario?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = [];

async function userCreate() {


}

function userCreate() {
  return new Promise(function (resolve, reject) {
    try {
      User.create( { _id: "70e18ae1b3fa572e8339c37e", "username" : "laura", "password" : "laura1981" } );
      resolve();
      }
      catch (e) {
      reject();

     }
  })
}

userCreate().then(function() {
  //mongoose.connection.close();
}).catch(function(e) {
  //mongoose.connection.close();
})
