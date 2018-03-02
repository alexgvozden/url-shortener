"use strict";

var Sequelize = require("sequelize");
var sequelize = new Sequelize("urlshortener", "gvozden", "", {
  host: "localhost",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
});

var Urls = sequelize.define("urls", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  originalUrl: { type: Sequelize.STRING, allowNull: false },
  shortUrlSlug: { type: Sequelize.STRING, allowNull: false },
  visits: { type: Sequelize.INTEGER, defaultValue: 0 }
});

sequelize.sync().then(function () {
  return Urls.create({
    originalUrl: "https://test/com",
    shortUrlSlug: "x1"
  });
}).then(function (url) {
  console.log(url.toJSON());
});