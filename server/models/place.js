const Sequelize = require('sequelize');
const sequelize = require('../db/init.js');
const Memory = sequelize.import('./memory.js');
const Flag = sequelize.import('./flag.js');
const Photo = sequelize.import('./photo.js');
const uuidv4 = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  class Place extends Sequelize.Model {}
  Place.init({
    placeId: {type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, unique: true},
    lat: DataTypes.FLOAT,
    long: DataTypes.FLOAT,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
    openYear: DataTypes.INTEGER,
    closeDate: DataTypes.DATE,
    cityCouncilDistrict: DataTypes.INTEGER,
    category: DataTypes.STRING
  }, { sequelize });
  
  Place.hasMany(Flag, {foreignKey: 'placeId', targetKey: 'placeId', as: 'flags'});
  Place.hasMany(Memory, {foreignKey: 'placeId', targetKey: 'placeId', as: 'memories'});
  Place.hasMany(Photo, {foreignKey: 'placeId', targetKey: 'placeId', as: 'photos'});
  
  return Place;
}