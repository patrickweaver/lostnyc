const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Place extends Sequelize.Model {}
  Place.init({
    placeId: DataTypes.STRING,
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
  return Place;
}