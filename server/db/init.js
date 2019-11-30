const Sequelize = require('sequelize');

const logging = process.env.ENV.substr(0, 4).toUpperCase() === "PROD" ? false : true;

module.exports = new Sequelize('db', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  storage: './.data/sqlite.db',
  logging: logging
});