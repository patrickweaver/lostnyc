const Sequelize = require('sequelize');
const sequelize = require('./init.js');
const Place = sequelize.import('../models/place.js');
const User = sequelize.import('../models/user.js');

const uuidv4 = require('uuid/v4');

const hashPassword = require('../helpers/hashPassword.js');


module.exports = function() {
  sequelize.sync()
  .then(async function() {
    
    const pwHash = await hashPassword(process.env.ADMIN_PASSWORD);
    if (pwHash === 'error') {
      return;
    }
    
    return User.create({
      username: process.env.ADMIN_USERNAME,
      password: pwHash,
      permissions: 'superadmin'
    });
  })
}


  