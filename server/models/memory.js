const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Memory extends Sequelize.Model {}
  Memory.init({
    memoryId: Sequelize.STRING,
    placeId: Sequelize.STRING,
    body: Sequelize.TEXT,
    author: Sequelize.STRING
  }, { sequelize });
  return Memory;
}