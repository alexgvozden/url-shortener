"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sequelize = require("sequelize");

var DB = function () {
  function DB() {
    _classCallCheck(this, DB);

    this.sequelize = new Sequelize("urlshortener", "gvozden", "", {
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

    var Urls = this.sequelize.define("urls", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      originalUrl: { type: Sequelize.STRING, allowNull: false },
      shortUrlSlug: { type: Sequelize.STRING, allowNull: false },
      visits: { type: Sequelize.INTEGER, defaultValue: 0 }
    });
  }

  _createClass(DB, [{
    key: "init",
    value: function init() {
      return this.sequelize.sync();
    }
  }]);

  return DB;
}();

exports.default = DB;