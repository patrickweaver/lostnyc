const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Sequelize.Model {}
  User.init({
    userId: {type: DataTypes.STRING, primaryKey: true},
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    permissions: Sequelize.STRING
  }, { sequelize });
  return User;
}