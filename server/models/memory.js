const Sequelize = require('sequelize');
const sequelize = require('../db/init.js');
const Flag = sequelize.import('./flag.js');
const uuidv4 = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  class Memory extends Sequelize.Model {}
  Memory.init({
    memoryId: {type: DataTypes.STRING, primaryKey: true, defaultValue: uuidv4(), unique: true},
    body: Sequelize.TEXT,
    author: Sequelize.STRING
  }, { sequelize });
  
  Memory.hasMany(Flag, {foreignKey: 'memoryId', targetKey: 'memoryId', as: 'flags'});
  
  return Memory;
}