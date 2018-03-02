import path from "path";
import express from "express";
import bodyParser from "body-parser";

import DB from "./db";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = new DB();

db.init();

// create new url
app.post("/url", (req, res) => {
  console.log("submitted url ", req.body.url);

  res.send(JSON.stringify({ success: true }));
});

// serve index page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(8080);
console.log("Listening on 8080");
