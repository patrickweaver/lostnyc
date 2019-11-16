const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Flag extends Sequelize.Model {}
  Flag.init({
    flagId: {type: DataTypes.STRING, primaryKey: true},
    body: Sequelize.TEXT
  }, { sequelize });
  return Flag;
}