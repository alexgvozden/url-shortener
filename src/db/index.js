const Sequelize = require("sequelize");

class DB {
  constructor() {
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

    const Urls = this.sequelize.define("urls", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      originalUrl: { type: Sequelize.STRING, allowNull: false },
      shortUrlSlug: { type: Sequelize.STRING, allowNull: false },
      visits: { type: Sequelize.INTEGER, defaultValue: 0 }
    });
  }

  init() {
    return this.sequelize.sync();
  }
}

export default DB;
