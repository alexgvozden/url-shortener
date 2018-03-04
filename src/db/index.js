const Sequelize = require('sequelize');
const crypto = require('crypto');
const Op = Sequelize.Op;

import { USER, PASS, HOST, DATABASE, PORT } from '../config/db';

class DB {
  constructor(uri) {
    let pgOpts;
    if (uri) {
      //const url = require('url').parse(uri);
      this.sequelize = new Sequelize(uri, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
          ssl: true
        },
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        },
        // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
        operatorsAliases: false
      });
    } else {
      // local config from file
      pgOpts = {
        pathname: DATABASE,
        port: PORT,
        host: HOST,
        user: USER,
        pass: PASS
      };
      this.sequelize = new Sequelize(
        pgOpts.pathname,
        pgOpts.user,
        pgOpts.pass,
        {
          host: pgOpts.hostname,
          port: pgOpts.port,
          dialect: 'postgres',
          pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
          },
          // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
          operatorsAliases: false
        }
      );
    }
    console.log('CONNECTING TO ', JSON.stringify(pgOpts));

    this.Urls = this.sequelize.define(
      'urls',
      {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        url: { type: Sequelize.STRING, allowNull: false },
        alias: { type: Sequelize.STRING, allowNull: false },
        visits: { type: Sequelize.INTEGER, defaultValue: 0 },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
        }
      },
      {
        indexes: [
          { unique: true, fields: ['url', 'alias'] },
          {
            name: 'url_alias_index',
            method: 'BTREE',
            fields: ['url', 'alias']
          },
          {
            name: 'alias_index',
            method: 'BTREE',
            fields: ['alias']
          }
        ],
        timestamps: false,
        tableName: 'urls'
      }
    );
  }

  init() {
    return this.sequelize.sync();
  }

  async addUrl(url, alias) {
    // find first
    try {
      // check if url already exists in the db
      // we do have unique constraint on both fields but I would rather check
      // and not throw errors on existing values
      const exists = await this.Urls.findAndCountAll({
        where: {
          [Op.or]: [
            {
              url: url
            },
            {
              alias: alias
            }
          ]
        },
        limit: 2
      });

      const found = exists.count;

      // url and alias do not exist in database
      // console.log('exists', exists.count);
      if (found == 0) {
        let aliasExists;
        // no existing found, insert new url
        if (alias == '') {
          do {
            alias = crypto
              .createHash('md5')
              .update(url)
              .digest('hex');
            alias = alias.substring(0, 6);
            // check if this generated alias is not used already
            aliasExists = await this.Urls.count({
              where: { alias: alias }
            });
            // loop through creating alias until one that is free available
          } while (aliasExists > 0);
        }
        await this.Urls.create({ url: url, alias: alias });

        // all good return alias and success
        return { success: true, alias: alias };
        //
      } else if (found == 2) {
        // both url and alias exist in database
        return { error: 'URL and alias exist in database' };
      } else if (found == 1) {
        // check if url or alias is issue
        if (exists.rows[0].url == url) {
          return { error: 'URL already exists in database' };
        } else {
          return { error: 'Alias already exists in database' };
        }
      }
    } catch (error) {
      return { error: error.toString() };
    }
  }

  async getUrlFromAlias(alias) {
    try {
      const url = await this.Urls.findOne({
        where: { alias: alias }
      });

      if (url) {
        await url.update({ visits: url.visits + 1 });
        return { success: true, url: url.url };
      } else {
        return { error: 'Invalid alias specified, cannot redirect to URL' };
      }
    } catch (error) {
      return { error: error.toString() };
    }
  }

  async getLatest() {
    try {
      const latest = await this.Urls.findAll({
        order: [['createdAt', 'DESC']],
        limit: 100
      });

      if (latest) return latest;
    } catch (error) {}
    return [];
  }

  async getMostViewed() {
    try {
      const mostViewed = await this.Urls.findAll({
        order: [['visits', 'DESC']],
        limit: 100
      });
      if (mostViewed) return mostViewed;
    } catch (error) {}

    return [];
  }
}

export default DB;
