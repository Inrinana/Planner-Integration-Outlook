var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var indexRouter = require('./routes/index');
var authorize = require('./routes/authorize');
var resetPass = require('./routes/resetPass');
var mail = require('./routes/mail');
var changePass = require('./routes/changePass');
var dbauth = require('./routes/db_authorize');
var ins = require('./routes/insert_task');
var tskEdit = require('./routes/edit_task');
var del = require('./routes/delete_task');
var tskComplete = require('./routes/complete_incomplete');
var gr = require('./routes/graph_route');
var hbs = require("hbs");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use('/',express.static(path.join(__dirname,'/public')));
app.use('/', indexRouter);
app.use('/authorize', authorize);

app.use('/mail', mail);
app.use('/resetPass', resetPass);
app.use('/changePass',changePass);
app.use('/db_authorize', dbauth);
app.use('/insert_task', ins);
app.use('/edit_task', tskEdit);
app.use('/delete_task', del);
app.use('/complete_incomplete',tskComplete);
app.use('/graph_route', gr);

hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

module.exports = app;


