require('babel-polyfill');

import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';

const PORT = 3000;

import DB from './db';

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
const csrfProtection = csrf({ cookie: true });
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = new DB();

async function start() {
  const dbInit = await db.init();
}

start();

// create new url
app.post('/url', csrfProtection, (req, res) => {
  console.log('submitted url ', req.body.url);

  res.send(JSON.stringify({ success: true }));
});

// serve index page
app.get('/', csrfProtection, function(req, res) {
  res.render('home', { csrfToken: req.csrfToken() });
  // res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(PORT);
console.log(`Listening on ${PORT}`);
