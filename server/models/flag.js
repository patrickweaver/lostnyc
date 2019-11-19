const Sequelize = require('sequelize');
const uuidv4 = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  class Flag extends Sequelize.Model {}
  Flag.init({
    flagId: {type: DataTypes.STRING, primaryKey: true, defaultValue: uuidv4(), unique: true},
    body: Sequelize.TEXT
  }, { sequelize });
  return Flag;
}