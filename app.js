require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const flash = require('connect-flash');
require('express-async-errors');

const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');

const indexRouter = require('./routes/index');
const inventoryRouter = require('./routes/inventory');
const itemRouter = require('./routes/items');
const categoryRouter = require('./routes/categories');
const inventarioRouter = require('./routes/inventario');
const recetasRouter = require('./routes/recetas');
const usersRouter = require('./routes/users');

const session = require("express-session");
const passport = require("passport");

require('./config/passport')(passport)

const LocalStrategy = require("passport-local").Strategy;

const entradasRouter = require('./routes/entradas');
const salidasRouter = require('./routes/salidas');

const app = express();

// Set up mongoose connection
const mongoDB = "process.env.MONGODB_URI";
mongoose.connect('mongodb://localhost:27017/server', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
mongoose.set('useFindAndModify', false);
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(flash());

app.use(session({
  secret : 'secret',
  resave : true,
  saveUninitialized : true
}));


app.use((req,res,next)=> {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error  = req.flash('error');
  next();
  })

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'semantic')));

app.use('/', indexRouter);

app.use('/inventory/items', itemRouter);
app.use('/inventory/categories', categoryRouter);
app.use('/inventario', inventarioRouter);
app.use('/recetas', recetasRouter);

app.use('/salidas', salidasRouter);
app.use('/entradas', entradasRouter);
app.use('/users',usersRouter);
app.use('/logout', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
