
var express = require('express')
  , hbs = require('hbs');


/**
 * App.
 */

var app = module.exports = express();


/**
 * Settings.
 */

app
  .set('views', __dirname)
  .engine('html', hbs.__express);

//ntp
app.get('/ntp', function (req, res, next) {
  if(req.get('x-ntp')) return res.send("" + Date.now(), 200);
  next();
});

/**
 * Home page.
 */

app.get('*', function (req, res, next) {
  res.render('index.html');
});