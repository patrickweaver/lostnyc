const Sequelize = require('sequelize');
const uuidv4 = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  class Photo extends Sequelize.Model {}
  Photo.init({
    photoId: {type: DataTypes.UUID, primaryKey: true, unique: true},
    approved: {type: DataTypes.BOOLEAN, defaultValue: false},
    highlighted: {type: DataTypes.BOOLEAN, defaultValue: false}
  }, { sequelize });
  return Photo;
}