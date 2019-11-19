const Sequelize = require('sequelize');
const uuidv4 = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  class Flag extends Sequelize.Model {}
  Flag.init({
    flagId: {type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, unique: true},
    body: Sequelize.TEXT,
    dismissed: {type: DataTypes.BOOLEAN, defaultValue: false}
  }, { sequelize });
  return Flag;
}


/*
type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDv4
            */