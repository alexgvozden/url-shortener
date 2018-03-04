require('babel-polyfill');

import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';

import { isURL } from './utils/URL';

const PORT = 3000;

import DB from './db';
const db = new DB();

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

// init db tables
db.init();

let initialVars = {
  // true if new url was saved
  success: false,
  // url if new url is saved
  urlSaved: '',
  // alias if new url is saved
  aliasSaved: '',
  // errors
  // general error
  error: false,
  errorMessage: '',
  // error for url
  errorUrl: false,
  // error for alias
  errorAlias: false,
  // form url
  url: '',
  // form alias
  alias: ''
};

// create new url
app.post('/', csrfProtection, async (req, res) => {
  let vars = { ...initialVars, csrfToken: req.csrfToken() };

  // check for proper submitted url
  if (!req.body.url || !isURL(req.body.url)) {
    vars.errorUrl = true;
  }

  // if alias is sent, check if it contains only letters number and hyphen
  if (req.body.alias && !/^[aA-zZ0-9-]+$/g.test(req.body.alias)) {
    vars.errorAlias = true;
  }

  // process url and create new short url if no errors
  if (!vars.errorUrl && !vars.errorAlias) {
    const addUrl = await db.addUrl(req.body.url, req.body.alias);
    if (addUrl.error) {
      vars.error = true;
      vars.errorMessage = addUrl.error;
    } else if (addUrl.success) {
      // successfully added url
      vars.success = true;
      vars.urlSaved = req.body.url;
      vars.aliasSaved =
        req.protocol + '://' + req.headers.host + '/' + addUrl.alias;
    }
  }

  // return results if any error is detected
  if (vars.error || vars.errorUrl || vars.errorAlias) {
    // assign previous values so user can correct errors
    vars.url = req.body.url;
    vars.alias = req.body.alias;
  }

  // render the page
  res.render('home', vars);
});

// serve index page
app.get('/', csrfProtection, function(req, res) {
  res.render('home', { ...initialVars, csrfToken: req.csrfToken() });
});

app.listen(PORT);
console.log(`Listening on ${PORT}`);
