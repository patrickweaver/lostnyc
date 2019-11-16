const Sequelize = require('sequelize');
const sequelize = require('../db/init.js');
const Memory = sequelize.import('./memory.js');
const Flag = sequelize.import('./flag.js');

module.exports = (sequelize, DataTypes) => {
  class Place extends Sequelize.Model {}
  Place.init({
    placeId: {type: DataTypes.STRING, primaryKey: true},
    lat: DataTypes.FLOAT,
    long: DataTypes.FLOAT,
    name: DataTypes.STRING,
    streetNumber: DataTypes.STRING,
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
    openYear: DataTypes.INTEGER,
    closeDate: DataTypes.DATE,
    cityCouncilDistrict: DataTypes.INTEGER
  }, { sequelize });
  
  Place.hasMany(Flag, {foreignKey: 'placeId', targetKey: 'placeId', as: 'flags'});
  Place.hasMany(Memory, {foreignKey: 'placeId', targetKey: 'placeId', as: 'memories'});
  
  return Place;
}