require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
require('express-async-errors');

const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');

const indexRouter = require('./routes/index');
const inventarioRouter = require('./routes/inventario');
const recetasRouter = require('./routes/recetas');
const entradasRouter = require('./routes/entradas');
const salidasRouter = require('./routes/salidas');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const loginOutRouter = require('./routes/logout');
const authMiddleware = require('./routes/middleware');


const app = express();
//
// Set up mongoose connection
const mongoDB = "process.env.MONGODB_URI";
mongoose.connect('mongodb+srv://laura:laura1981@cluster0.xuvtr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect('mongodb://localhost:27017/server', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
mongoose.set('useFindAndModify', false);
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('keyboard_cat'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'semantic')));

app.use('/', indexRouter);

app.use('/inventario', authMiddleware.ensureLoggedIn, inventarioRouter);
app.use('/recetas', authMiddleware.ensureLoggedIn, recetasRouter);

app.use('/salidas', authMiddleware.ensureLoggedIn, salidasRouter);
app.use('/entradas', authMiddleware.ensureLoggedIn, entradasRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/logout', loginOutRouter);

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
