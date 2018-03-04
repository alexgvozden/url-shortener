require('babel-polyfill');

import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';

import { isURL } from './utils/URL';

const PORT = 3000;

import DB from './db';

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
const csrfProtection = csrf({ cookie: true });
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// error handling for token
app.use(function(err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  // handle CSRF token errors here
  res.status(403);
  res.send('form tampered with');
});

const db = new DB();

async function start() {
  const dbInit = await db.init();
}

start();

// create new url
app.post('/', csrfProtection, (req, res) => {
  let vars = {
    csrfToken: req.csrfToken(),
    errorUrl: false,
    errorAlias: false,
    url: '',
    alias: ''
  };

  // check for proper submitted url
  if (!req.body.url || !isURL(req.body.url)) {
    vars.errorUrl = true;
  }

  // if alias is sent, check if it contains only letters number and hyphen
  if (req.body.alias && !/^[aA-zZ0-9-]+$/g.test(req.body.alias)) {
    vars.errorAlias = true;
  }

  // return results if any error is detected
  if (vars.errorUrl || vars.errorAlias) {
    // assign previous values so user can correct errors
    vars.url = req.body.url;
    vars.alias = req.body.alias;
    res.render('home', vars);
  }

  // process url and create new short url

  // render the page
  res.render('home', vars);
});

// serve index page
app.get('/', csrfProtection, function(req, res) {
  let vars = {
    csrfToken: req.csrfToken(),
    errorUrl: false,
    errorAlias: false,
    url: '',
    alias: ''
  };

  res.render('home', vars);
  // res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(PORT);
console.log(`Listening on ${PORT}`);
