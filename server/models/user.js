const Sequelize = require('sequelize');
const uuidv4 = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  class User extends Sequelize.Model {}
  User.init({
    userId: {type: DataTypes.STRING, primaryKey: true, defaultValue: uuidv4(), unique: true},
    username: {type: DataTypes.STRING, unique: true},
    password: Sequelize.STRING,
    permissions: Sequelize.STRING
  }, { sequelize });
  return User;
}